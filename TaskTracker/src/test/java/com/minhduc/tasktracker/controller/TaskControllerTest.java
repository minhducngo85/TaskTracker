package com.minhduc.tasktracker.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.minhduc.tasktracker.dto.DtoMapper;
import com.minhduc.tasktracker.dto.MyWorkDto;
import com.minhduc.tasktracker.dto.TaskDto;
import com.minhduc.tasktracker.dto.TaskStatisticsResponse;
import com.minhduc.tasktracker.entity.Task;
import com.minhduc.tasktracker.entity.TaskHistory;
import com.minhduc.tasktracker.entity.TaskPriority;
import com.minhduc.tasktracker.entity.TaskStatus;
import com.minhduc.tasktracker.security.SecurityUtils;
import com.minhduc.tasktracker.security.TestSecurityConfig;
import com.minhduc.tasktracker.service.TaskService;
import com.minhduc.tasktracker.service.UserService;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * @author Minh Duc Ngo - 2026
 * 
 */
@WebMvcTest(TaskController.class)
@Import(TestSecurityConfig.class)
@DisplayName("TaskController Integration Tests (MockMvc)")
public class TaskControllerTest {
    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockitoBean
    TaskService taskService;

    @MockitoBean
    UserService userService;

    private Task sampleTask;
    private TaskDto sampleDto;

    // JwtFilter là @Component nên bị Spring scan và instantiate ngay cả trong
    // @WebMvcTest.
    // JwtFilter cần JwtService qua constructor injection → phải mock để tránh crash
    // context.
    @MockitoBean
    com.minhduc.tasktracker.service.JwtService jwtService;

    @BeforeEach
    void setUp() {
	sampleTask = new Task();
	sampleTask.setId(1L);
	sampleTask.setTitle("Fix login bug");
	sampleTask.setDescription("JWT not refreshing");
	sampleTask.setStatus(TaskStatus.TODO);
	sampleTask.setPriority(TaskPriority.HIGH);
	sampleTask.setAssignedTo("mngo");
	sampleTask.setCreatedAt(Instant.now());
	sampleTask.setUpdatedAt(Instant.now());
	sampleTask.setTags(List.of("backend", "auth"));
	sampleDto = DtoMapper.mapTaskToDto(sampleTask);
    }

    // =========================================================
    // GET /api/tasks/all
    // =========================================================
    @Nested
    @DisplayName("GET /api/tasks/all")
    class GetAllTasks {
	@Test
      @WithMockUser
      @DisplayName("Should return 200 with list of tasks")
          void shouldReturn200WithTasks() throws Exception {
              when(taskService.getAll()).thenReturn(List.of(sampleTask));
   
              mockMvc.perform(get("/api/tasks/all"))
              .andExpect(status().isOk())
              .andExpect(jsonPath("$", hasSize(1)))
              .andExpect(jsonPath("$[0].title").value("Fix login bug"))
              .andExpect(jsonPath("$[0].priority").value("HIGH"));
      }

	@Test
          @DisplayName("Should filter by priority when param provided")
          void shouldFilterByPriority() throws Exception { 
    		  when(taskService.findByPriority(TaskPriority.HIGH)).thenReturn(List.of(sampleTask));
    		  
    		  mockMvc.perform(get("/api/tasks/all").param("priority", "HIGH"))
    		  .andExpect(status().isOk())
    		  .andExpect(jsonPath("$[0].priority").value("HIGH"));
    		  
    		  verify(taskService).findByPriority(TaskPriority.HIGH);
              verify(taskService, never()).getAll();
    	  }

	@Test
	        @DisplayName("Should return empty list when no tasks exist")
	        void shouldReturnEmptyList() throws Exception {
	            when(taskService.getAll()).thenReturn(List.of());
	 
	            mockMvc.perform(get("/api/tasks/all"))
	                .andExpect(status().isOk())
	                .andExpect(jsonPath("$", hasSize(0)));
	        }
    }

    // =========================================================
    // GET /api/tasks (paginated)
    // =========================================================
    @Nested
    @DisplayName("GET /api/tasks")
    class GetTasksPaginated {
	@Test
	@DisplayName("Should return 200 with paginated tasks")
	void shouldReturnPage() throws Exception {

	    Page<Task> page = new PageImpl<Task>(List.of(sampleTask));
	    when(taskService.getTasks(any(), eq(0), eq(0), any())).thenReturn(page);

	    mockMvc.perform(get("/api/tasks").param("page", "0").param("size", "0")).andExpect(status().isOk())
		    .andExpect(jsonPath("$.content", hasSize(1)))
		    .andExpect(jsonPath("$.content[0].title").value("Fix login bug"))
		    .andExpect(jsonPath("$.totalPages").value(1));

	}

	@Test
	@DisplayName("Should return empty page when no tasks match filter")
	void shouldReturnEmptyPage() throws Exception {
	    Page<Task> emptyPage = new PageImpl<>(List.of(), PageRequest.of(0, 10), 0L);
	    when(taskService.getTasks(any(), anyInt(), anyInt(), any())).thenReturn(emptyPage);

	    mockMvc.perform(get("/api/tasks").param("sort", "title,asc")).andExpect(status().isOk())
		    .andExpect(jsonPath("$.totalPages").value(0)).andExpect(jsonPath("$.empty").value(true));
	}
    }

    // =========================================================
    // GET /api/tasks/{id}
    // =========================================================
    @Nested
    @DisplayName("GET /api/tasks/{id}")
    class GetTask {

	@Test
        @DisplayName("Should return 200 with task when found")
        void shouldReturnTask() throws Exception {
            when(taskService.getTask(1L)).thenReturn(sampleTask);
 
            mockMvc.perform(get("/api/tasks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Fix login bug"))
                .andExpect(jsonPath("$.status").value("TODO"));
        }

	@Test
        @DisplayName("Should return 404 when task not found")
        void shouldReturn404() throws Exception {
            when(taskService.getTask(99L))
                .thenThrow(new com.minhduc.tasktracker.controller.exceptionhandling
                    .ResourceNotFoundException("Task not found with id: 99"));
 
            mockMvc.perform(get("/api/tasks/99"))
                .andExpect(status().isNotFound());
        }
    }

    // =========================================================
    // POST /api/tasks
    // =========================================================
    @Nested
    @DisplayName("POST /api/tasks")
    class CreateTask {

	@Test
	@DisplayName("Should return 200 with created task")
	void shouldCreateTask() throws Exception {
	    Task input = new Task();
	    input.setTitle("New task");
	    input.setPriority(TaskPriority.MEDIUM);

	    when(taskService.create(any(Task.class))).thenReturn(sampleTask);

	    mockMvc.perform(post("/api/tasks").contentType(MediaType.APPLICATION_JSON)
		    .content(objectMapper.writeValueAsString(input))).andExpect(status().isOk())
		    .andExpect(jsonPath("$.title").value("Fix login bug"));
	}

	@Test
        @DisplayName("Should call taskService.create() exactly once")
        void shouldCallServiceOnce() throws Exception {
            when(taskService.create(any())).thenReturn(sampleTask);
 
            mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new Task())));
 
            verify(taskService, times(1)).create(any(Task.class));
        }
    }

    // =========================================================
    // PUT /api/tasks/{id}
    // =========================================================
    @Nested
    @DisplayName("PUT /api/tasks/{id}")
    class UpdateTask {

	@Test
	@DisplayName("Should return 200 with updated task")
	void shouldUpdateTask() throws Exception {
	    Task updatedResult = new Task();
	    updatedResult.setId(1L);
	    updatedResult.setTitle("Updated title");
	    updatedResult.setStatus(TaskStatus.IN_PROGRESS);
	    updatedResult.setPriority(TaskPriority.CRITICAL);

	    when(taskService.update(eq(1L), any(Task.class))).thenReturn(updatedResult);

	    mockMvc.perform(put("/api/tasks/1").contentType(MediaType.APPLICATION_JSON)
		    .content(objectMapper.writeValueAsString(updatedResult))).andExpect(status().isOk())
		    .andExpect(jsonPath("$.title").value("Updated title"))
		    .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
	}

	@Test
        @DisplayName("Should return 404 when updating non-existent task")
        void shouldReturn404() throws Exception {
            when(taskService.update(eq(99L), any()))
                .thenThrow(new com.minhduc.tasktracker.controller.exceptionhandling
                    .ResourceNotFoundException("Task not found with id: 99"));
 
            mockMvc.perform(put("/api/tasks/99")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(new Task())))
                .andExpect(status().isNotFound());
        }
    }

    // =========================================================
    // DELETE /api/tasks/{id}
    // =========================================================
    @Nested
    @DisplayName("DELETE /api/tasks/{id}")
    class DeleteTask {

	@Test
	@DisplayName("Should return 200 when deleted successfully")
	void shouldDeleteTask() throws Exception {
	    doNothing().when(taskService).delete(1L);

	    mockMvc.perform(delete("/api/tasks/1")).andExpect(status().isOk());

	    verify(taskService).delete(1L);
	}

	@Test
	@DisplayName("Should return 404 when task not found")
	void shouldReturn404() throws Exception {
	    doThrow(new com.minhduc.tasktracker.controller.exceptionhandling.ResourceNotFoundException(
		    "Task not found with id: 99")).when(taskService).delete(99L);

	    mockMvc.perform(delete("/api/tasks/99")).andExpect(status().isNotFound());
	}
    }

    // =========================================================
    // GET /api/tasks/stats
    // =========================================================
    @Nested
    @DisplayName("GET /api/tasks/stats")
    class GetStats {

	@Test
	@DisplayName("Should return statistics response")
	void shouldReturnStats() throws Exception {
	    TaskStatisticsResponse stats = new TaskStatisticsResponse();
	    stats.setTotal(10L);
	    stats.setTodo(4L);
	    stats.setInProgress(3L);
	    stats.setDone(3L);
	    stats.setCritical(2L);
	    stats.setHigh(3L);
	    stats.setMedium(4L);
	    stats.setLow(1L);

	    when(taskService.getStatistics()).thenReturn(stats);

	    mockMvc.perform(get("/api/tasks/stats")).andExpect(status().isOk()).andExpect(jsonPath("$.total").value(10))
		    .andExpect(jsonPath("$.todo").value(4)).andExpect(jsonPath("$.done").value(3));
	}
    }

    // =========================================================
    // GET /api/tasks/{taskId}/history
    // =========================================================
    @Nested
    @DisplayName("GET /api/tasks/{taskId}/history")
    class GetHistory {

	@Test
	@DisplayName("Should return paginated history")
	void shouldReturnHistory() throws Exception {
	    TaskHistory h = new TaskHistory();
	    h.setField("status");
	    h.setOldValue("TODO");
	    h.setNewValue("IN_PROGRESS");

	    Page<TaskHistory> page = new PageImpl<>(List.of(h), org.springframework.data.domain.PageRequest.of(0, 5),
		    1L);
	    when(taskService.getHistory(eq(1L), eq(0), eq(5))).thenReturn(page);

	    mockMvc.perform(get("/api/tasks/1/history").param("page", "0").param("size", "5"))
		    .andExpect(status().isOk()).andExpect(jsonPath("$.content[0].field").value("status"))
		    .andExpect(jsonPath("$.content[0].oldValue").value("TODO"))
		    .andExpect(jsonPath("$.content[0].newValue").value("IN_PROGRESS"));
	}
    }

    // =========================================================
    // GET /api/tasks/tags
    // =========================================================
    @Nested
    @DisplayName("GET /api/tasks/tags")
    class GetTags {

	@Test
        @DisplayName("Should return list of unique tags")
        void shouldReturnTags() throws Exception {
            when(taskService.getAllTags()).thenReturn(List.of("backend", "auth", "frontend"));
 
            mockMvc.perform(get("/api/tasks/tags"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[0]").value("backend"));
        }
    }

    // =========================================================
    // GET /api/tasks/my-work
    // =========================================================
    @Nested
    @DisplayName("GET /api/tasks/my-work")
    class GetMyWork {

	@Test
	@DisplayName("Should return my-work summary for current user")
	void shouldReturnMyWork() throws Exception {
	    MyWorkDto myWork = new MyWorkDto(2, 1, 3);

	    try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
		su.when(SecurityUtils::getCurrentUser).thenReturn("mngo");
		when(taskService.getMyWork("mngo")).thenReturn(myWork);

		mockMvc.perform(get("/api/tasks/my-work")).andExpect(status().isOk())
			.andExpect(jsonPath("$.overdue").value(2)).andExpect(jsonPath("$.today").value(1))
			.andExpect(jsonPath("$.thisWeek").value(3));
	    }
	}
    }

    // =========================================================
    // GET /api/tasks/my-tasks
    // =========================================================
    @Nested
    @DisplayName("GET /api/tasks/my-tasks")
    class GetMyActiveTasks {

	@Test
	@DisplayName("Should return active tasks for current user")
	void shouldReturnMyActiveTasks() throws Exception {
	    try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
		su.when(SecurityUtils::getCurrentUser).thenReturn("mgno");
		when(taskService.getMyActiveTask()).thenReturn(List.of(sampleTask));

		mockMvc.perform(get("/api/tasks/my-tasks")).andExpect(status().isOk())
			.andExpect(jsonPath("$", hasSize(1))).andExpect(jsonPath("$[0].assignedTo").value("mngo"));
	    }
	}
    }

    // =========================================================
    // GET /api/tasks/complete-tasks
    // =========================================================
    @Nested
    @DisplayName("GET /api/tasks/complete-tasks")
    class GetCompleteTasks {

	@Test
        @DisplayName("Should return done tasks with default lastDays=7")
        void shouldReturnDoneTasksDefault() throws Exception {
            when(taskService.getDoneTaskLastDays(7)).thenReturn(List.of(sampleTask));
 
            mockMvc.perform(get("/api/tasks/complete-tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
        }

	@Test
        @DisplayName("Should accept custom lastDays param")
        void shouldAcceptCustomLastDays() throws Exception {
            when(taskService.getDoneTaskLastDays(14)).thenReturn(List.of(sampleTask));
 
            mockMvc.perform(get("/api/tasks/complete-tasks").param("lastDays", "14"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
 
            verify(taskService).getDoneTaskLastDays(14);
        }
    }

}
