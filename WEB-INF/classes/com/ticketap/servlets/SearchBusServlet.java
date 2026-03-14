package com.ticketap.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Date;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import com.ticketap.util.DBConnection;

public class SearchBusServlet extends HttpServlet {

    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        String from = req.getParameter("from");
        String to = req.getParameter("to");
        String date = req.getParameter("date");

        res.setContentType("text/html");
        PrintWriter out = res.getWriter();

        try {
            Connection con = DBConnection.getConnection();
            PreparedStatement ps = con.prepareStatement(
                "SELECT * FROM buses WHERE source=? AND destination=? AND journey_date=?"
            );

            ps.setString(1, from);
            ps.setString(2, to);
            ps.setDate(3, Date.valueOf(date));

            ResultSet rs = ps.executeQuery();

            boolean found = false;
            while (rs.next()) {
                found = true;
                out.println("<p>");
                out.println(rs.getString("operator") + 
                            " | ₹" + rs.getInt("fare") + 
                            " | Seats: " + rs.getInt("seats_available"));
                out.println("</p>");
            }

            if (!found) {
                out.println("<p>No buses found for selected route/date</p>");
            }

        } catch (Exception e) {
            e.printStackTrace();
            out.println("<p>Error: " + e.getMessage() + "</p>");
        }
    }
}
