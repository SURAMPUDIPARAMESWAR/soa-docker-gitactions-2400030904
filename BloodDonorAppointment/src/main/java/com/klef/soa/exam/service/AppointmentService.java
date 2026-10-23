package com.klef.soa.exam.service;

import java.util.List;
import java.util.Optional;

import com.klef.soa.exam.entity.Appointment;

public interface AppointmentService {
	
	Appointment addAppointment(Appointment request);
	
	List<Appointment> getAllAppointments();
	
	Optional<Appointment> getAppointmentById(Long id);
	
	Optional<Appointment> updateAppointment(Long id, Appointment request);
	
	String deleteAppointment(Long id);

}
