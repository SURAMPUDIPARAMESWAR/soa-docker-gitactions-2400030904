package com.klef.soa.exam;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BloodDonorAppointmentApplication {

	public static void main(String[] args) {
		SpringApplication.run(BloodDonorAppointmentApplication.class, args);
		System.out.println("BloodDonorApplication Service is Running...");
	}

}
