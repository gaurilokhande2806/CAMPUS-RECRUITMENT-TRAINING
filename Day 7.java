// // OpenGL: Used when high-performance, hardware-accelerated 3D rendering is needed for advanced medical monitoring. Used for making graphs in C++




// #include<stdio.h>
// void main(){
//     int a =1;
//     printf("%d %d %d" , ++a , a++ , a++);
// }

// //output is 4 2 1 
// it shows undefined behaviour , different compiler shows different output, as we are modifying 




// The seven core steps to complete this process in Java include:
// Import packages: Bring in the java.sql.* classes.
// Register driver: Load the database's specific driver.
// Establish connection: Link Java to the database.
// Create statement: Build a container for the query.
// Execute query: Send the SQL instructions.
// Retrieve results: Process the returned data.
// Close connection: Release the database resources.





import java.sql.*;

public class main {
    public static void main(String args[]) {
        try {

            //Load driver
            Class.forName("com.mysql.cj.jdbc.Driver");

            //Establishing the connection
            Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/", "root", "root");

            //Declaring the Statement 
            Statement st = con.createStatement();

            //Executing query 
            st.execute("create database if not exists ITA");
            st.execute("use ITA");

            st.execute("create table if not exists student (name varchar(255), roll_no int)");

            st.execute("insert into student values ('Amit', 1)");

            //Obtaining result
            ResultSet rs = st.executeQuery("select * from student");

            while (rs.next()) {
                System.out.println(rs.getString(1) + " " + rs.getInt(2));
            }

            //Closing statement
            con.close();

        } catch (Exception e) {
            System.out.println(e);
        }
    }
}