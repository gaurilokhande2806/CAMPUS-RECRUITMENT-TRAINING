// cognizant questions :-
//     https://www.hackerrank.com/contests/cts-a-coding-questions/challenges


// Math.ceil() always rounds a number up to the next highest integer and returns a double,
//  whereas Math.round() rounds a number to its nearest mathematical integer using standard 
//  half-up rules and returns an integer type (int or long)














// Sunland operates two types of transport services for its annual Summer Festival: Buses and Shuttles, where a bus can carry up to 80 people and a shuttle can carry up to 8 people.

// There are N people eager to visit the festival, and the city government needs to transport all of them from various starting points to the festival grounds in the most cost-efficient way possible. You know that the fuel price in Sunland is 75 coins per litre, and:

// Each Bus requires P litres of fuel to complete the trip. Each Shuttle requires Q litres of fuel for the same trip.

// Your task

// Find and return an integer value representing the minimum fuel cost to transport all N people to the festival.

// Input Format

// An integer value N representing the total number of people.
// An integer value P representing the litres of fuel used by one bus.
// An integer value Q representing the litres of fuel used by one shuttle.
// Constraints

// NA

// Output Format

// Return an integer value representing the minimum fuel cost required to transport all people to the festival grounds.

// Sample Input 0

// 240 
// 50 
// 8 
// Sample Output 0

// 11250 
// Explanation 0

// Here, there are 240 people, P = 50, and Q = 8.

// To transport 240 people, we can use 3 Buses (since each bus carries 80 people).

// Total cost:

// 3 × 50 × 75 = 11250 coins

// No shuttles are needed in this case.

// Thus, 11250 is returned as the output.

// Sample Input 1

// 95 
// 60 
// 10
// Sample Output 1

// 6000
// Explanation 1

// Here, there are 95 people, P = 60, and Q = 10.

// We can transport 80 people in the following manner:

// 80 people will be transported using 1 bus, which will cost:

// 1 × 60 × 75 = 4500 coins

// The remaining 15 people can be transported using 2 shuttles, costing:

// 2 × 10 × 75 = 1500 coins

// Thus, the total cost will be:

// 4500 + 1500 = 6000 coins

// Hence, 6000 is returned as output.


// import java.io.*;
// import java.util.*;

// public class Solution {

//     public static void main(String[] args) {
        
//         Scanner sc = new Scanner(System.in);
//         int N = sc.nextInt();
//         int P = sc.nextInt();
//         int Q = sc.nextInt();
//         int cost = Integer.MAX_VALUE;

//         int min_cost; 
//         int bus_count=0;
//         int shuttle_count = 0;
        
//         for(int bus = 0; bus<=N/80; bus++){
//             int remain = N - (bus*80);
//             int shuttle = (int)Math.ceil(remain/8.0);
//             int tempcost = (bus*P*75) + (shuttle*Q*75);
//             cost = Math.min(cost,tempcost);
//         } 
//         System.out.println(cost);
//     }
// }













// Sum of Highest Square and Highest Cubelocked
// Problem
// Submissions
// Leaderboard
// Discussions
// Mike is given an integer number N. He is asked to find out all those numbers within the range of 1 to N (inclusive), which are:

// Either Square of any number or;
// Cube of any number
// Find and return the sum of the highest square and the highest cube in the range of 1 to N (inclusive).

// Input Format

// An integer value N.

// Constraints

// NA

// Output Format

// Return an integer value representing the sum of the highest square and the highest cube.

// Sample Input 0

// 10
// Sample Output 0

// 17
// Explanation 0

// In this scenario, we have a range of 1 to 10. In this range, there are below numbers which follow the logic:

// 1: square and cube of 1
// 4: square of 2
// 8: cube of 2
// 9: square of 3
// The highest square is 9

// The highest cube is 8

// Sum of these numbers = 8 + 9 = 17. Therefore, 17 is returned as the output.

// Sample Input 1

// 64
// Sample Output 1

// 128
// Explanation 1

// In this scenario, we have a range of 1 to 64. In this range, there are below numbers which follow the logic:

// 1: square and cube of 1
// 4: square of 2
// 8: cube of 2
// 9: square of 3
// 16: square of 4
// 25: square of 5
// 27: cube of 3
// 36: square of 6
// 49: square of 7
// 64: square of 8 and cube of 4
// The highest square is 64

// The highest cube is 64

// Sum of these numbers = 64 + 64 = 128. Therefore, 128 is returned as the output.


// import java.util.*;
// public class Solution {
//     public static void main(String[] args) {
//         Scanner sc = new Scanner(System.in);

//         int n = sc.nextInt();

//         int squareRoot = (int) Math.sqrt(n);
//         int largestSquare = squareRoot * squareRoot;

//         int cubeRoot = (int) Math.cbrt(n);
//         int largestCube = cubeRoot * cubeRoot * cubeRoot;

//         int sum = largestSquare + largestCube;

//         System.out.println(sum);
//     }
// }



// //Another approch
// import java.io.*;
// import java.util.*;

// public class Solution {

//     public static void main(String[] args) {
//         Scanner sc = new Scanner(System.in);
//         int n= sc.nextInt();
//         int sq = 0;
//         int cube = 0;
//         for(int i=1; i*i<=n;i++){
//             sq = i*i;
//         }
//         for(int i=1 ; i*i*i <=n; i++){
//             cube = i*i*i;
//         }
//         System.out.println(cube+sq);
//     }
// }














// Digital Root of Ancient Scroll Number
// import java.util.*;

// public class Solution {
//     public static void main(String[] args) {
//         Scanner sc = new Scanner(System.in);

//         int n = sc.nextInt();

//         while (n >= 10) {
//             int sum = 0;

//             while (n != 0) {
//                 sum += n % 10;
//                 n /= 10;
//             }

//             n = sum;
//         }

//         System.out.println(n);
//     }
// }