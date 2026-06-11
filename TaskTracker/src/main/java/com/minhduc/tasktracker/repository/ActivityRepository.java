package com.minhduc.tasktracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.minhduc.tasktracker.entity.Activity;

public interface ActivityRepository extends JpaRepository<Activity, Long>{

}
