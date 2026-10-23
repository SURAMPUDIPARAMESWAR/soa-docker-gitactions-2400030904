package com.klef.soa.exam.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.soa.exam.entity.Appointment;
import com.klef.soa.exam.repository.AppointmentRepository;

@Service
public class AppointmentServiceImpl implements AppointmentService{

	@Autowired
	private AppointmentRepository repository;
	@Override
	public Appointment addAppointment(Appointment request) {
		return repository.save(request);
	}

	@Override
	public List<Appointment> getAllAppointments() {
		return repository.findAll();
	}

	@Override
	public Optional<Appointment> getAppointmentById(Long id) {
		return repository.findById(id);
	}

	@Override
	public Optional<Appointment> updateAppointment(Long id, Appointment request) {
		return repository.findById(id).map(appointment -> {
			appointment.setDonorName(request.getDonorName());
			appointment.setBloodGroup(request.getBloodGroup());
			appointment.setAppointmentDate(request.getAppointmentDate());
			appointment.setConfirmed(request.isConfirmed());
			return repository.save(appointment);
		});
	}

	@Override
	public String deleteAppointment(Long id) {
		boolean flag = repository.existsById(id);
		if (flag) {
			repository.deleteById(id);
			return "Appointment Deleted Successfully";
		}
		else {
			return "Appointment ID Not Found";
		}
	}
	
	

}
