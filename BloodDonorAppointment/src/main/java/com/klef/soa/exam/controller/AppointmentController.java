package com.klef.soa.exam.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.klef.soa.exam.entity.Appointment;
import com.klef.soa.exam.service.AppointmentService;

@RestController
@CrossOrigin(origins = "*")
public class AppointmentController {
	
	@Autowired
	private AppointmentService service;
	
	@GetMapping("/")
	public String demo() {
		return "BloodDonorAppointment Service is Running";
	}
	
	@PostMapping("/Add")
	public ResponseEntity<Appointment> addAppointment(@RequestBody Appointment request) {
		
		Appointment napp = service.addAppointment(request);
		return ResponseEntity.status(201).body(napp);
	}
	
	@GetMapping("/DisplayAll")
	public ResponseEntity<List<Appointment>> displayAllAppointments()
	{
		List<Appointment> apps = service.getAllAppointments();
		return ResponseEntity.status(200).body(apps);
	} 

	@GetMapping("/Display/{id}")
	public ResponseEntity<Appointment> displayAppointment(@PathVariable Long id) {
		Optional<Appointment> appointment = service.getAppointmentById(id);
		return appointment.map(value -> ResponseEntity.ok(value))
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PutMapping("/Update/{id}")
	public ResponseEntity<Appointment> updateAppointment(
			@PathVariable Long id, @RequestBody Appointment request) {
		Optional<Appointment> appointment = service.updateAppointment(id, request);
		return appointment.map(value -> ResponseEntity.ok(value))
				.orElseGet(() -> ResponseEntity.notFound().build());
	}
	
	@DeleteMapping("/Delete/{id}")
	public ResponseEntity<String> deleteAppointment(@PathVariable Long id) {
		
		String msg = service.deleteAppointment(id);
		return new ResponseEntity<>(msg, HttpStatus.OK);
	}

}
