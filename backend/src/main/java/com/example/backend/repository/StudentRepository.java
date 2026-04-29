package com.example.backend.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.example.backend.entity.Student;

@Repository
public class StudentRepository {

    private final JdbcTemplate jdbcTemplate;

    public StudentRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Student> findAll() {
        String sql = "SELECT id, name, email, course FROM students";
        return jdbcTemplate.query(sql, new StudentRowMapper());
    }

    public Optional<Student> findById(Integer id) {
        String sql = "SELECT id, name, email, course FROM students WHERE id = ?";
        List<Student> students = jdbcTemplate.query(sql, new StudentRowMapper(), id);
        return students.isEmpty() ? Optional.empty() : Optional.of(students.get(0));
    }

    public Student save(Student student) {
        if (student.getId() == null) {
            String sql = "INSERT INTO students (name, email, course) VALUES (?, ?, ?)";
            jdbcTemplate.update(sql, student.getName(), student.getEmail(), student.getCourse());

            Integer id = jdbcTemplate.queryForObject("SELECT LASTVAL()", Integer.class);
            student.setId(id);
        } else {
            String sql = "UPDATE students SET name = ?, email = ?, course = ? WHERE id = ?";
            jdbcTemplate.update(sql, student.getName(), student.getEmail(), student.getCourse(), student.getId());
        }
        return student;
    }

    public boolean update(Student student) {
        String sql = "UPDATE students SET name = ?, email = ?, course = ? WHERE id = ?";
        int rows = jdbcTemplate.update(
            sql,
            student.getName(),
            student.getEmail(),
            student.getCourse(),
            student.getId()
        );
        return rows > 0;
    }

    public void deleteById(Integer id) {
        String sql = "DELETE FROM students WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    private static class StudentRowMapper implements RowMapper<Student> {
        @Override
        public Student mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new Student(
                rs.getInt("id"),
                rs.getString("name"),
                rs.getString("email"),
                rs.getString("course")
            );
        }
    }
}
