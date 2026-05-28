// //INSERTION SORT
// // Time Complexity:
// // Best Case: O(n)
// // Average Case: O(n^2)
// // Worst Case: O(n^2)

// import java.util.Scanner;

// public class InsertionSort {

//     static void insertionSort(int arr[], int n) {

//         for(int i = 1; i < n; i++) {

//             int key = arr[i];
//             int j = i - 1;

//             while(j >= 0 && arr[j] > key) {
//                 arr[j + 1] = arr[j];
//                 j--;
//             }

//             arr[j + 1] = key;
//         }
//     }

//     public static void main(String[] args) {

//         Scanner sc = new Scanner(System.in);

//         System.out.print("Enter number of elements: ");
//         int n = sc.nextInt();

//         int arr[] = new int[n];

//         System.out.println("Enter array elements:");
//         for(int i = 0; i < n; i++) {
//             arr[i] = sc.nextInt();
//         }

//         insertionSort(arr, n);

//         System.out.println("Sorted array:");
//         for(int i = 0; i < n; i++) {
//             System.out.print(arr[i] + " ");
//         }

//         sc.close();
//     }
// }











// //SELECTION SORT 
// // Time Complexity:
// // Best Case: O(n^2)
// // Average Case: O(n^2)
// // Worst Case: O(n^2)

// import java.util.Scanner;

// public class SelectionSort {

//     static void selectionSort(int arr[], int n) {

//         for(int i = 0; i < n - 1; i++) {

//             int minIndex = i;

//             for(int j = i + 1; j < n; j++) {

//                 if(arr[j] < arr[minIndex]) {
//                     minIndex = j;
//                 }
//             }

//             int temp = arr[minIndex];
//             arr[minIndex] = arr[i];
//             arr[i] = temp;
//         }
//     }

//     public static void main(String[] args) {

//         Scanner sc = new Scanner(System.in);

//         System.out.print("Enter number of elements: ");
//         int n = sc.nextInt();

//         int arr[] = new int[n];

//         System.out.println("Enter array elements:");
//         for(int i = 0; i < n; i++) {
//             arr[i] = sc.nextInt();
//         }

//         selectionSort(arr, n);

//         System.out.println("Sorted array:");
//         for(int i = 0; i < n; i++) {
//             System.out.print(arr[i] + " ");
//         }

//         sc.close();
//     }
// }

















// // Bubble Sort in Java
// import java.util.Scanner;

// public class BubbleSort {
    
//     static void bubbleSort(int arr[], int n) {
//         for(int i = 0; i < n - 1; i++) {
//             for(int j = 0; j < n - i - 1; j++) {
//                 if(arr[j] > arr[j + 1]) {
//                     int temp = arr[j];
//                     arr[j] = arr[j + 1];
//                     arr[j + 1] = temp;
//                 }
//             }
//         }
//     }

//     public static void main(String[] args) {
//         Scanner sc = new Scanner(System.in);

//         System.out.print("Enter number of elements: ");
//         int n = sc.nextInt();

//         int arr[] = new int[n];

//         System.out.println("Enter array elements:");
//         for(int i = 0; i < n; i++) {
//             arr[i] = sc.nextInt();
//         }

//         bubbleSort(arr, n);

//         System.out.println("Sorted array:");
//         for(int i = 0; i < n; i++) {
//             System.out.print(arr[i] + " ");
//         }

//         sc.close();
//     }
// }











// // Merge Sort in Java
// import java.util.Scanner;

// public class MergeSort {

//     static void merge(int arr[], int left, int mid, int right) {

//         int n1 = mid - left + 1;
//         int n2 = right - mid;

//         int L[] = new int[n1];
//         int R[] = new int[n2];

//         for(int i = 0; i < n1; i++)
//             L[i] = arr[left + i];

//         for(int j = 0; j < n2; j++)
//             R[j] = arr[mid + 1 + j];

//         int i = 0, j = 0, k = left;

//         while(i < n1 && j < n2) {
//             if(L[i] <= R[j]) {
//                 arr[k] = L[i];
//                 i++;
//             } else {
//                 arr[k] = R[j];
//                 j++;
//             }
//             k++;
//         }

//         while(i < n1) {
//             arr[k] = L[i];
//             i++;
//             k++;
//         }

//         while(j < n2) {
//             arr[k] = R[j];
//             j++;
//             k++;
//         }
//     }

//     static void mergeSort(int arr[], int left, int right) {
//         if(left < right) {

//             int mid = (left + right) / 2;

//             mergeSort(arr, left, mid);
//             mergeSort(arr, mid + 1, right);

//             merge(arr, left, mid, right);
//         }
//     }

//     public static void main(String[] args) {

//         Scanner sc = new Scanner(System.in);

//         System.out.print("Enter number of elements: ");
//         int n = sc.nextInt();

//         int arr[] = new int[n];

//         System.out.println("Enter array elements:");
//         for(int i = 0; i < n; i++) {
//             arr[i] = sc.nextInt();
//         }

//         mergeSort(arr, 0, n - 1);

//         System.out.println("Sorted array:");
//         for(int i = 0; i < n; i++) {
//             System.out.print(arr[i] + " ");
//         }

//         sc.close();
//     }
// }











// //QUICK SORT IN JAVA
// import java.util.*;
// public class Quicksort {

//     static void quick(int arr[], int low, int high) {
//         if (low < high) {
//             int pvt = partition(arr, low, high);

//             quick(arr, low, pvt - 1);
//             quick(arr, pvt + 1, high);
//         }
//     }

//     static int partition(int arr[], int low, int high) {
//         int pivot = arr[high];
//         int j = low - 1;

//         for (int i = low; i <= high - 1; i++) {
//             if (arr[i] <= pivot) {
//                 j++;

//                 int temp = arr[i];
//                 arr[i] = arr[j];
//                 arr[j] = temp;
//             }
//         }

//         int temp = arr[j + 1];
//         arr[j + 1] = arr[high];
//         arr[high] = temp;

//         return j + 1;
//     }

//     public static void main(String args[]) {

//         Scanner sc = new Scanner(System.in);

//         int size = sc.nextInt();
//         int arr[] = new int[size];

//         for (int i = 0; i < size; i++) {
//             arr[i] = sc.nextInt();
//         }

//         quick(arr, 0, size - 1);

//         for (int i = 0; i < size; i++) {
//             System.out.print(arr[i] + " ");
//         }

//         sc.close();
//     }
// }