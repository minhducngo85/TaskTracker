package com.minhduc.tasktracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.minhduc.tasktracker.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long>{

}
