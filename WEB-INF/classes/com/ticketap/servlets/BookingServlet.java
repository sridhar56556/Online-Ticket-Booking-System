package com.ticketap.servlets;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import com.ticketap.util.DBConnection;

public class BookingServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        System.out.println("✅ BookingServlet HIT");

        HttpSession session = req.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            resp.sendError(401, "Not logged in");
            return;
        }

        int userId = (int) session.getAttribute("userId");

        String service = req.getParameter("service");
        String operator = req.getParameter("operator");
        String from = req.getParameter("from");
        String to = req.getParameter("to");
        String date = req.getParameter("date");
        String time = req.getParameter("time");
        String type = req.getParameter("type");
        int passengers = Integer.parseInt(req.getParameter("passengers"));
        double total = Double.parseDouble(req.getParameter("total"));
        String payment = req.getParameter("payment");

        try (Connection con = DBConnection.getConnection()) {

            String sql = "INSERT INTO bookings " +
                    "(user_id, service, operator, from_city, to_city, journey_date, journey_time, type, passengers, total, payment) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            PreparedStatement ps = con.prepareStatement(sql);

            ps.setInt(1, userId);
            ps.setString(2, service);
            ps.setString(3, operator);
            ps.setString(4, from);
            ps.setString(5, to);
            ps.setString(6, date);
            ps.setString(7, time);
            ps.setString(8, type);
            ps.setInt(9, passengers);
            ps.setDouble(10, total);
            ps.setString(11, payment);

            int rows = ps.executeUpdate();
            System.out.println("✅ Rows inserted: " + rows);

            resp.setStatus(HttpServletResponse.SC_OK);

        } catch (Exception e) {
            e.printStackTrace();
            resp.sendError(500, "DB Error");
        }
    }
}
