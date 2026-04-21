package com.minhduc.tasktracker.specification;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;

import com.minhduc.tasktracker.dto.TaskFilterRequest;
import com.minhduc.tasktracker.entity.Task;

import jakarta.persistence.criteria.Predicate;

public class TaskSpecification {

	public static Specification<Task> filter(TaskFilterRequest req) {
		return (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();

			// keyword predicate
			if (!StringUtils.isBlank(req.getKeyword())) {
				predicates.add(cb.like(cb.lower(root.get("title")), "%" + req.getKeyword().toLowerCase() + "%"));
			}

			// status
			if (req.getStatus() != null) {
				predicates.add(cb.equal(root.get("status"), req.getStatus()));
			}

			// priority
			if (req.getPriority() != null) {
				predicates.add(cb.equal(root.get("priority"), req.getPriority()));
			}
			
			if (req.getAssignedTo() != null) {
                predicates.add(cb.like(
                        cb.lower(root.get("assignedTo")),
                        "%" + req.getAssignedTo().toLowerCase() + "%"
                ));
            }

			return cb.and(predicates.toArray(new Predicate[0]));
		};
	}
}
