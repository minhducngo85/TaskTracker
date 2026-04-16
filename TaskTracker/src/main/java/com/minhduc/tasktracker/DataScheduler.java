package com.minhduc.tasktracker;

import javax.sql.DataSource;

import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Slf4j
@Component
@AllArgsConstructor
public class DataScheduler {

	 private final DataSource dataSource;
	 
	@Scheduled(fixedRate = 30 * 60 * 1000)
	public void runSqlFile() {
		log.info("runSqlFile()");
	    ResourceDatabasePopulator populator =
	        new ResourceDatabasePopulator(new ClassPathResource("data.sql"));
	    populator.execute(dataSource);
	}
}
