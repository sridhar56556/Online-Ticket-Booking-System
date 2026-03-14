package com.ticketap.servlets;

import java.io.*;
import java.sql.*;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;

import com.ticketap.util.DBConnection;
    @WebServlet("/signup")
public class SignupServlet extends HttpServlet {

    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        String name = req.getParameter("name");
        String mobile = req.getParameter("mobile");
        String email = req.getParameter("email");
        String password = req.getParameter("password");

        res.setContentType("text/plain");
        PrintWriter out = res.getWriter();

        try {

            Connection con = DBConnection.getConnection();

            PreparedStatement ps = con.prepareStatement(
                "INSERT INTO users(name, mobile, email, password) VALUES (?, ?, ?, ?)"
            );

            ps.setString(1, name);
            ps.setString(2, mobile);
            ps.setString(3, email);
            ps.setString(4, password);

            ps.executeUpdate();

            out.print("Signup successful");

            ps.close();
            con.close();

        } catch (SQLIntegrityConstraintViolationException e) {

            res.setStatus(400);
            out.print("Email already registered");

        } catch (Exception e) {

            e.printStackTrace();
            res.setStatus(500);
            out.print("Signup failed");
        }
    }
}