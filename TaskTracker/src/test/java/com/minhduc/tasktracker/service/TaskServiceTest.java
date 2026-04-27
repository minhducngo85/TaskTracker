package com.minhduc.tasktracker.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import com.minhduc.tasktracker.controller.exceptionhandling.ResourceNotFoundException;
import com.minhduc.tasktracker.dto.TaskFilterRequest;
import com.minhduc.tasktracker.dto.TaskStatisticsResponse;
import com.minhduc.tasktracker.entity.Task;
import com.minhduc.tasktracker.entity.TaskHistory;
import com.minhduc.tasktracker.entity.TaskPriority;
import com.minhduc.tasktracker.entity.TaskStatus;
import com.minhduc.tasktracker.entity.User;
import com.minhduc.tasktracker.repository.TaskHistoryRepository;
import com.minhduc.tasktracker.repository.TaskRepository;
import com.minhduc.tasktracker.repository.UserRepository;
import com.minhduc.tasktracker.security.SecurityUtils;

@ExtendWith(MockitoExtension.class)
@DisplayName("TaskService Unit Tests")
public class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;
    @Mock
    private TaskHistoryRepository taskHistoryRepository;
    @Mock
    private UserRepository userRepo;

    /** Object to be tested */
    @InjectMocks
    private TaskService taskService;

    private Task sampleTask;

    @BeforeEach
    void setUp() {
        // call helper to make sure that tags is new mutable ArrayList
	sampleTask = buildSampleTask();
    }
    
    
    /**
     * Tạo fresh Task với mutable ArrayList cho tags.
     * Không dùng setTags() vì nó gọi .toList() → immutable list
     * → task.getTags().clear() trong update() sẽ crash.
     */
    private Task buildSampleTask() {
        Task t = new Task();
        t.setId(1L);
        t.setTitle("Fix login bug");
        t.setDescription("JWT token not refreshing");
        t.setStatus(TaskStatus.TODO);
        t.setPriority(TaskPriority.HIGH);
        t.setAssignedTo("john");
        t.setCreatedAt(Instant.now());
        t.setUpdatedAt(Instant.now());
        t.getTags().addAll(List.of("backend", "auth")); // ArrayList mutable từ new Task()
        return t;
    }
    // =========================================================
    // getAll()
    // =========================================================
    @Nested
    @DisplayName("getAll()")
    class GetAll {

	@Test
        @DisplayName("Should return list of tasks sorted by createdAt desc")
        void shouldReturnAllTasks() {
            when(taskRepository.findAll(any(Sort.class))).thenReturn(List.of(sampleTask));
 
            List<Task> result = taskService.getAll();
 
            assertThat(result).hasSize(1);
            assertThat(result.get(0).getTitle()).isEqualTo("Fix login bug");
            verify(taskRepository).findAll(any(Sort.class));
        }

	@Test
        @DisplayName("Should return empty list when no tasks")
        void shouldReturnEmptyList() {
            when(taskRepository.findAll(any(Sort.class))).thenReturn(List.of());
 
            List<Task> result = taskService.getAll();
 
            assertThat(result).isEmpty();
        }
    }

    
    // =========================================================
    // create()
    // =========================================================
    @Nested
    @DisplayName("create()")
    class Create {
 
        @Test
        @DisplayName("Should always set status to TODO regardless of input")
        void shouldSetStatusToTodo() {
            Task input = new Task();
            input.setTitle("New task");
            input.setStatus(TaskStatus.IN_PROGRESS); // bị override
            input.setPriority(TaskPriority.MEDIUM);
 
            Task saved = new Task();
            saved.setId(2L);
            saved.setTitle("New task");
            saved.setStatus(TaskStatus.TODO);
 
            try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
                su.when(SecurityUtils::getCurrentUser).thenReturn("admin");
                when(taskRepository.save(any(Task.class))).thenReturn(saved);
                when(userRepo.findByUsername("admin")).thenReturn(Optional.of(buildUser("admin", "Admin User")));
                when(taskHistoryRepository.save(any(TaskHistory.class))).thenReturn(new TaskHistory());
 
                Task result = taskService.create(input);
 
                assertThat(input.getStatus()).isEqualTo(TaskStatus.TODO);
                assertThat(result.getId()).isEqualTo(2L);
                verify(taskRepository).save(input);
                verify(taskHistoryRepository).save(any(TaskHistory.class)); // history được ghi
            }
        }
 
        @Test
        @DisplayName("Should save history with field='task' when creating")
        void shouldSaveHistoryOnCreate() {
            Task input = new Task();
            input.setTitle("Task A");
            input.setPriority(TaskPriority.LOW);
 
            Task saved = new Task();
            saved.setId(5L);
            saved.setTitle("Task A");
            saved.setStatus(TaskStatus.TODO);
 
            try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
                su.when(SecurityUtils::getCurrentUser).thenReturn("admin");
                when(taskRepository.save(any())).thenReturn(saved);
                when(userRepo.findByUsername("admin")).thenReturn(Optional.empty());
                when(taskHistoryRepository.save(any(TaskHistory.class))).thenReturn(new TaskHistory());
 
                taskService.create(input);
 
                verify(taskHistoryRepository).save(argThat(h ->
                    "task".equals(h.getField()) && "Task created".equals(h.getNewValue())
                ));
            }
        }
    }
 
    // =========================================================
    // update()
    // =========================================================
    @Nested
    @DisplayName("update()")
    class Update {
 
        @Test
        @DisplayName("Should update all fields and return updated task")
        void shouldUpdateFields() {
            Task updated = new Task();
            updated.setTitle("Updated title");
            updated.setDescription("New desc");
            updated.setStatus(TaskStatus.IN_PROGRESS);
            updated.setPriority(TaskPriority.CRITICAL);
            updated.setAssignedTo("jane");
            updated.setTags(List.of("frontend"));
 
            try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
                su.when(SecurityUtils::getCurrentUser).thenReturn("admin");
                when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));
                when(taskRepository.save(any(Task.class))).thenReturn(sampleTask);
                when(userRepo.findByUsername("admin")).thenReturn(Optional.of(buildUser("admin", "Admin")));
                when(taskHistoryRepository.save(any())).thenReturn(new TaskHistory());
 
                Task result = taskService.update(1L, updated);
 
                assertThat(result).isNotNull();
                verify(taskRepository).save(sampleTask);
                // Phải có history cho title, description, status, priority, assignedTo, tags
                verify(taskHistoryRepository, atLeast(5)).save(any(TaskHistory.class));
            }
        }
 
        @Test
        @DisplayName("Should throw ResourceNotFoundException when task not found")
        void shouldThrowWhenNotFound() {
            when(taskRepository.findById(99L)).thenReturn(Optional.empty());
 
            assertThatThrownBy(() -> taskService.update(99L, new Task()))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
        }
 
        @Test
        @DisplayName("Should NOT save history when nothing changes")
        void shouldNotSaveHistoryWhenNoChange() {
            Task updated = new Task();
            updated.setTitle(sampleTask.getTitle());
            updated.setDescription(sampleTask.getDescription());
            updated.setStatus(sampleTask.getStatus());
            updated.setPriority(sampleTask.getPriority());
            updated.setAssignedTo(sampleTask.getAssignedTo());
            //updated.setTags(List.of("backend", "auth")); // same tags
            // getTags().addAll() để giữ mutable list
            updated.getTags().addAll(List.of("backend", "auth"));
            
            try (MockedStatic<SecurityUtils> su = mockStatic(SecurityUtils.class)) {
                su.when(SecurityUtils::getCurrentUser).thenReturn("admin");
                Task freshTask = buildSampleTask(); 
                when(taskRepository.findById(1L)).thenReturn(Optional.of(freshTask));
                when(taskRepository.save(any())).thenReturn(freshTask);
 
                taskService.update(1L, updated);
 
                verify(taskHistoryRepository, never()).save(any());
            }
        }
    }
 
    // =========================================================
    // delete()
    // =========================================================
    @Nested
    @DisplayName("delete()")
    class Delete {
 
        @Test
        @DisplayName("Should delete task when found")
        void shouldDeleteTask() {
            when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));
 
            taskService.delete(1L);
 
            verify(taskRepository).deleteById(1L);
        }
 
        @Test
        @DisplayName("Should throw ResourceNotFoundException when task not found")
        void shouldThrowWhenNotFound() {
            when(taskRepository.findById(99L)).thenReturn(Optional.empty());
 
            assertThatThrownBy(() -> taskService.delete(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
 
            verify(taskRepository, never()).deleteById(any());
        }
    }
 
    // =========================================================
    // getTask()
    // =========================================================
    @Nested
    @DisplayName("getTask()")
    class GetTask {
 
        @Test
        @DisplayName("Should return task by id")
        void shouldReturnTask() {
            when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));
 
            Task result = taskService.getTask(1L);
 
            assertThat(result.getId()).isEqualTo(1L);
            assertThat(result.getTitle()).isEqualTo("Fix login bug");
        }
 
        @Test
        @DisplayName("Should throw when task not found")
        void shouldThrowWhenNotFound() {
            when(taskRepository.findById(404L)).thenReturn(Optional.empty());
 
            assertThatThrownBy(() -> taskService.getTask(404L))
                .isInstanceOf(ResourceNotFoundException.class);
        }
    }
 
    // =========================================================
    // getStatistics()
    // =========================================================
    @Nested
    @DisplayName("getStatistics()")
    class GetStatistics {
 
        @Test
        @DisplayName("Should aggregate counts correctly")
        void shouldReturnCorrectStats() {
            when(taskRepository.count()).thenReturn(10L);
            when(taskRepository.countByPriority(TaskPriority.CRITICAL)).thenReturn(2L);
            when(taskRepository.countByPriority(TaskPriority.HIGH)).thenReturn(3L);
            when(taskRepository.countByPriority(TaskPriority.MEDIUM)).thenReturn(4L);
            when(taskRepository.countByPriority(TaskPriority.LOW)).thenReturn(1L);
            when(taskRepository.countByStatus(TaskStatus.TODO)).thenReturn(5L);
            when(taskRepository.countByStatus(TaskStatus.IN_PROGRESS)).thenReturn(3L);
            when(taskRepository.countByStatus(TaskStatus.DONE)).thenReturn(2L);
 
            TaskStatisticsResponse stats = taskService.getStatistics();
 
            assertThat(stats.getTotal()).isEqualTo(10L);
            assertThat(stats.getCritical()).isEqualTo(2L);
            assertThat(stats.getHigh()).isEqualTo(3L);
            assertThat(stats.getMedium()).isEqualTo(4L);
            assertThat(stats.getLow()).isEqualTo(1L);
            assertThat(stats.getTodo()).isEqualTo(5L);
            assertThat(stats.getInProgress()).isEqualTo(3L);
            assertThat(stats.getDone()).isEqualTo(2L);
        }
    }
 
    // =========================================================
    // findByPriority()
    // =========================================================
    @Nested
    @DisplayName("findByPriority()")
    class FindByPriority {
 
        @Test
        @DisplayName("Should return tasks filtered by priority")
        void shouldFilterByPriority() {
            when(taskRepository.findByPriority(TaskPriority.HIGH)).thenReturn(List.of(sampleTask));
 
            List<Task> result = taskService.findByPriority(TaskPriority.HIGH);
 
            assertThat(result).hasSize(1);
            assertThat(result.get(0).getPriority()).isEqualTo(TaskPriority.HIGH);
        }
    }
 
    // =========================================================
    // getTasks() with filter
    // =========================================================
    @Nested
    @DisplayName("getTasks()")
    class GetTasks {
 
        @Test
        @DisplayName("Should return paged tasks with desc sort")
        void shouldReturnPagedTasks() {
            Page<Task> page = new PageImpl<>(List.of(sampleTask));
            when(taskRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);
 
            Page<Task> result = taskService.getTasks(new TaskFilterRequest(), 0, 10, new String[]{"createdAt", "desc"});
 
            assertThat(result.getTotalElements()).isEqualTo(1);
        }
 
        @Test
        @DisplayName("Should default sort direction to asc when not provided")
        void shouldDefaultToAscSort() {
            Page<Task> page = new PageImpl<>(List.of());
            when(taskRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);
 
            // sort array chỉ có field, không có direction
            Page<Task> result = taskService.getTasks(new TaskFilterRequest(), 0, 10, new String[]{"title"});
 
            assertThat(result).isNotNull();
        }
    }
 
    // =========================================================
    // getHistory()
    // =========================================================
    @Nested
    @DisplayName("getHistory()")
    class GetHistory {
 
        @Test
        @DisplayName("Should return paginated history for a task")
        void shouldReturnHistory() {
            TaskHistory h = new TaskHistory();
            h.setField("status");
            h.setOldValue("TODO");
            h.setNewValue("IN_PROGRESS");
 
            Page<TaskHistory> page = new PageImpl<>(List.of(h));
            when(taskHistoryRepository.findByTaskIdOrderByChangedAtDesc(eq(1L), any(Pageable.class))).thenReturn(page);
 
            Page<TaskHistory> result = taskService.getHistory(1L, 0, 5);
 
            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0).getField()).isEqualTo("status");
        }
 
        @Test
        @DisplayName("Should cap size at 10 when size > 50")
        void shouldCapSizeWhenTooLarge() {
            Page<TaskHistory> page = new PageImpl<>(List.of());
            when(taskHistoryRepository.findByTaskIdOrderByChangedAtDesc(eq(1L), any(Pageable.class))).thenReturn(page);
 
            taskService.getHistory(1L, 0, 999); // size=999 → bị cap về 10
 
            verify(taskHistoryRepository).findByTaskIdOrderByChangedAtDesc(eq(1L),
                argThat(p -> p.getPageSize() == 10));
        }
 
        @Test
        @DisplayName("Should use page=0 when negative page passed")
        void shouldDefaultPageToZero() {
            Page<TaskHistory> page = new PageImpl<>(List.of());
            when(taskHistoryRepository.findByTaskIdOrderByChangedAtDesc(eq(1L), any(Pageable.class))).thenReturn(page);
 
            taskService.getHistory(1L, -5, 5); // page < 0 → reset về 0
 
            verify(taskHistoryRepository).findByTaskIdOrderByChangedAtDesc(eq(1L),
                argThat(p -> p.getPageNumber() == 0));
        }
    }
 
    // =========================================================
    // getDoneTaskLastDays()
    // =========================================================
    @Nested
    @DisplayName("getDoneTaskLastDays()")
    class GetDoneTaskLastDays {
 
        @Test
        @DisplayName("Should query done tasks within given day range")
        void shouldReturnDoneTasks() {
            when(taskRepository.findDoneTask(any(Instant.class))).thenReturn(List.of(sampleTask));
 
            List<Task> result = taskService.getDoneTaskLastDays(7);
 
            assertThat(result).hasSize(1);
            verify(taskRepository).findDoneTask(any(Instant.class));
        }
    }
 
    // =========================================================
    // Helper
    // =========================================================
    private User buildUser(String username, String fullname) {
        User u = new User();
        u.setUsername(username);
        u.setFullname(fullname);
        return u;
    }
}
