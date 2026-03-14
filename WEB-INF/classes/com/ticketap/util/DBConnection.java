package com.ticketap.util;

import java.sql.Connection;
import java.sql.DriverManager;

public class DBConnection {

    public static Connection getConnection() {
        Connection con = null;

        try {
            // Load MySQL Driver
            Class.forName("com.mysql.cj.jdbc.Driver");

            // DB details (change password if needed)
            String url = "jdbc:mysql://localhost:3306/ticketap?useSSL=false&serverTimezone=UTC";
            String user = "root";
            String password = "sridhar123SS";  // <-- change this

            con = DriverManager.getConnection(url, user, password);

        } catch (Exception e) {
            e.printStackTrace();
        }

        return con;
    }
}
