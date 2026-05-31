// QUESTIONS TO STUDY 
//     1. real time applications of sorting
//     2. How to pass arguments and take imput while declaring , 

// NOTES;-
//     optimization of the bubble sort :- create flags to skip the passes
//     To optimize Bubble Sort, you can implement two primary techniques: Early Termination using a flag and Exclusion of Sorted Element
//     s to reduce redundant comparisons. While a standard Bubble Sort always runs in \(O(n^2)\) time, these optimizations improve the best-case time 
//     complexity to \(O(n)\) for an already-sorted array.1. Track Swaps for Early TerminationThe most common optimization is adding a boolean "swapped" flag. 

//     If a full pass completes without a single swap, it means every element is already in the correct order relative to its neighbor, and the
//     algorithm can stop immediately.Logic: Initialize swapped = false at the start of each outer loop pass.Action: If any two elements are swapped 
//     in the inner loop, set swapped = true.Result: If swapped remains false after the inner loop finishes, break the outer loop.2. Skip Already-Sorted
//     ElementsAfter each pass of the outer loop, the largest element "bubbles up" to its correct position at the end of the array. You do not
//     need to re-check these elements in subsequent passes.Logic: 
    
//     The \(i\)-th pass places the \(i\)-th largest element in its final 
//     position.Action: Change the inner loop range from n-1 to n-i-1 (where \(i\) is the current pass number).Result: This reduces the number of 
//     comparisons from a constant \(n \times (n-1)\) to a decreasing sequence, roughly halving the total operations in the average case.


















// // Time Complexity: O(n^2)
// // Space Complexity: O(1)

// public class Search2DArray {

//     public static void main(String[] args) {

//         int arr[][] = {
//             {1, 2, 3, 4},
//             {5, 6, 7, 8},
//             {9, 10, 11, 12},
//             {13, 14, 15, 16}
//         };

//         int key = 11;

//         int k = 0;

//         for (int i = 0; i < 4; i++) {

//             for (int j = k; j <= i; j++) {

//                 if (arr[i][j] == key) {

//                     System.out.println("Element found at: " + i + " " + j);
//                 }
//             }

//             // Your condition
//             if (i == 4 && k < 4) {

//                 k++;
//                 i = k;
//             }
//         }
//     }
// }



















// // LINEAR SEARCH 
// // Time Complexity: O(n)
// // Space Complexity: O(1)

// import java.util.Scanner;
// public class LinearSearch {

//     public static void main(String[] args) {

//         Scanner sc = new Scanner(System.in);

//         // Input size
//         System.out.print("Enter size of array: ");
//         int n = sc.nextInt();

//         int arr[] = new int[n];

//         // Input array elements
//         System.out.println("Enter array elements:");

//         for (int i = 0; i < n; i++) {
//             arr[i] = sc.nextInt();
//         }

//         // Input key element
//         System.out.print("Enter element to search: ");
//         int key = sc.nextInt();

//         boolean found = false;

//         // Linear Search
//         for (int i = 0; i < n; i++) {

//             if (arr[i] == key) {

//                 System.out.println("Element found at index: " + i);
//                 found = true;
//                 break;
//             }
//         }

//         // If element not found
//         if (!found) {

//             System.out.println("Element not found");
//         }

//         sc.close();
//     }
// }














// //BINARY SEARCH 
// // Time Complexity: O(log n)
// // Space Complexity: O(1)

// import java.util.Scanner;
// import java.util.Arrays;

// public class BinarySearch {

//     public static void main(String[] args) {

//         Scanner sc = new Scanner(System.in);

//         // Input size
//         System.out.print("Enter size of array: ");
//         int n = sc.nextInt();

//         int arr[] = new int[n];

//         // Input array elements
//         System.out.println("Enter array elements:");

//         for (int i = 0; i < n; i++) {
//             arr[i] = sc.nextInt();
//         }

//         // Sort array for binary search
//         Arrays.sort(arr);

//         // Display sorted array
//         System.out.println("Sorted Array:");

//         for (int i = 0; i < n; i++) {
//             System.out.print(arr[i] + " ");
//         }

//         System.out.println();

//         // Input key
//         System.out.print("Enter element to search: ");
//         int key = sc.nextInt();

//         int low = 0;
//         int high = n - 1;

//         boolean found = false;

//         // Binary Search
//         while (low <= high) {

//             int mid = (low + high) / 2;

//             if (arr[mid] == key) {

//                 System.out.println("Element found at index: " + mid);
//                 found = true;
//                 break;
//             }

//             else if (arr[mid] < key) {

//                 low = mid + 1;
//             }

//             else {

//                 high = mid - 1;
//             }
//         }

//         // If not found
//         if (!found) {

//             System.out.println("Element not found");
//         }

//         sc.close();
//     }
// }





























// public class Fibonacci {
//     public static void main(String[] args) {
//         int n = 10; // number of terms

//         int a = 0, b = 1;

//         System.out.println("Fibonacci Series:");

//         for (int i = 1; i <= n; i++) {
//             System.out.print(a + " ");

//             int next = a + b;
//             a = b;
//             b = next;
//         }
//     }
// }







//REVERSE STRING USING RECURSION 
// public class ReverseStringRecursion {
//     static String reverse(String str) {
//         // Base case
//         if (str.isEmpty()) {
//             return str;
//         }

//         // Recursive case
//         return reverse(str.substring(1)) + str.charAt(0);
//     }

//     public static void main(String[] args) {
//         String input = "Hello";

//         String reversed = reverse(input);

//         System.out.println("Reversed String: " + reversed);
//     }
// }



// Time Complexity: O(n^2)
// Space Complexity: O(1)




















// import java.util.Scanner;

// public class SubArray {
//     public static void main(String[] args) {
//         Scanner sc = new Scanner(System.in);

//         System.out.println("Enter the size of the array:");
//         int size = sc.nextInt();
//         int[] arr = new int[size];

//         System.out.println("Enter the elements of the array:");
//         for (int i = 0; i < size; i++) {
//             arr[i] = sc.nextInt();
//         }
        
//         System.out.println("\n--- All SubArrays ---");

//         //METHOD 1
//         // for(int i = 0; i < size; i++ ){
//         //     for(int j=i; j < size; j++){
//         //         for(int k = i; k<=j ; k++){
//         //             System.out.println(arr[k] + " ");
//         //         }

//         //         System.err.println(" \t");

//         //     }
//         // }


//         //METHOD 2
//         // for (int i = 0; i < size; i++) {
//         //     StringBuilder sb = new StringBuilder();       // reset for each start
//         //     for (int j = i; j < size; j++) {
//         //         sb.append(arr[j]).append(" ");            // grow the subarray
//         //         System.out.println("[" + sb.toString().trim() + "]"); // print each
//         //     }
//         // }
        
//         //METHOD 3
//         // int i=4;
//         // int k=0;
//         // for(i=0; i<4;i++){
//         //     for(int j=k; j<=i; j++){
//         //         System.out.println(arr[j]+" ");
//         //         if(i==3 && k<3){
//         //             k++;
//         //             i=k;
//         //         }
//         //     }
//         //     System.out.println();
//         // }
        

//         //METHOD 4
//         int k = 0;
//         for (int i = 0; i < size; i++) {
//             for (int j = k; j <= i; j++) {
//                 System.out.print(arr[j] + " ");   // print, not println
//             }
//             System.out.println();
//             if (i == size - 1 && k < size - 1) {  // generalized condition
//                 k++;
//                 i = k - 1;   // k-1 because i++ in for will make it k
//             }
//         }
//         sc.close();
//     }
// }


// //Output of the code is 2 2
// public class main{
//     public static void main(String[] args) {
//         int i=0;
//         int j=0;
//         for(i=0; i<2;i++)
//             for(j=0; j<2; j++);
//         System.err.println(i+" "+j);
//     }
// }
