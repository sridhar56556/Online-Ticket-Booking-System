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
           Connection con = DriverManager.getConnection(
"jdbc:mysql://sql12.freesqldatabase.com:3306/sql12819964",
"sql12819964",
"1Dt4GyslnB"
); // <-- change this

            con = DriverManager.getConnection(url, user, password);

        } catch (Exception e) {
            e.printStackTrace();
        }

        return con;
    }
}
