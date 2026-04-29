package com.example.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.backend.entity.Student;
import com.example.backend.repository.StudentRepository;

@Service
public class StudentService {

    private final StudentRepository repo;

    public StudentService(StudentRepository repo) {
        this.repo = repo;
    }

    public List<Student> all() {
        return repo.findAll();
    }

    public Optional<Student> findById(Integer id) {
        return repo.findById(id);
    }

    public Student save(Student s) {
        return repo.save(s);
    }

    public Student update(Integer id, Student data) {
        data.setId(id);
        return repo.save(data);
    }

    public void delete(Integer id) {
        repo.deleteById(id);
    }
}