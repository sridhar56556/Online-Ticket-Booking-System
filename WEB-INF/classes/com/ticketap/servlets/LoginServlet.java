package com.ticketap.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;

import com.ticketap.util.DBConnection;

public class LoginServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        String email = request.getParameter("email");
        String password = request.getParameter("password");

        try {
            Connection con = DBConnection.getConnection();

            PreparedStatement ps = con.prepareStatement(
                "SELECT id, name, email FROM users WHERE email=? AND password=?"
            );

            ps.setString(1, email);
            ps.setString(2, password);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {

                HttpSession session = request.getSession();
                session.setAttribute("userId", rs.getInt("id"));
                session.setAttribute("name", rs.getString("name"));

                out.print("{\"status\":\"success\",\"name\":\"" + rs.getString("name") + "\"}");

            } else {

                out.print("{\"status\":\"fail\"}");
            }

            con.close();

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(500);
            out.print("{\"status\":\"error\"}");
        }
    }
}