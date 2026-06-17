// # LECTURE 3

// #include<stdio.h
// void main(){
//     int i=3;
//     int a[] = {1,2,3,4};
//     printf("%d", & i[a]);
// }
// Output of this code :- 4












//PRINTING A PYRAMID IN WHICH FIRST NUMBER OF A ROW IS EQUAL TO THE DIGGIT SUM OF THE PREVIOUS ROW 
        //                 1
        //             1       2
        //         3       4       5
        //     12      13      14      15
        // 18      19      20      21      22    AND SO ON


// import java.util.*;

// public class Main{
//     public static void main(String[] args) {

//         Scanner sc = new Scanner(System.in);
//         int rows = sc.nextInt();
//         int sum=0;
//         int num=1;

//         for(int i=0; i<rows;i++){
//             sum=0;
//             for(int j= rows; j>=i; j--){
//                 System.out.print(" ");
//             }

//             for(int k=0; k<=i;k++){
//                 System.out.print(num+" ");
//                 int temp = num;

//                 while(temp!=0){
//                     int rem = temp % 10;
//                     sum = sum + rem;
//                     temp /= 10;
//                 }
                
//                 num++;
//             }
//             num = sum;
//             System.out.println(" ");

//         }
//         sc.close();
//     }
// }
















// // LINKEDLIST
// import java.util.Scanner;
// public class Linkedlist{
//     static class node{
//         int data;
//         node next;

//         node(int data){
//             this.data = data;
//             this.next = null;
//         }
//     }
//     static node head = null;
//     public static void insertNode(int data){
//         node newNode = new node(data);

//         if(head==null){
//             head = newNode;
//         }

//         else{
//             node temp = head;

//             while(temp.next!=null){
//                 temp = temp.next;
//             }
//             temp.next = newNode;
//         }
//     }
// // Delete node
//     public static void deleteNode(int key) {

//         // If list is empty
//         if (head == null) {
//             System.out.println("Linked List is empty");
//             return;
//         }

//         // If head node contains the key
//         if (head.data == key) {
//             head = head.next;
//             return;
//         }

//         node temp = head;
//         node prev = null;

//         // Search for node
//         while (temp != null && temp.data != key) {
//             prev = temp;
//             temp = temp.next;
//         }

//         // If node not found
//         if (temp == null) {
//             System.out.println("Node not found");
//             return;
//         }

//         // Delete node
//         prev.next = temp.next;
//     }


//     public static void display(){

//         node temp = head;
//         while(temp!=null){
//             System.out.print(temp.data + " -> ");
//             temp = temp.next;
//         }
//         System.out.println("null");
//     }

//     public static void main(String[] args){
//         Scanner sc = new Scanner(System.in);
//         Linkedlist.insertNode(10);
//         Linkedlist.insertNode(20);
//         Linkedlist.insertNode(30);
//         Linkedlist.insertNode(40);

//         System.out.println("Linked list : ");
//         display();
//         sc.close();

//         // Delete node
//         deleteNode(20);

//         System.out.println("After deleting 20:");
//         display();

//         sc.close();

//     }
// }















// //DOUBLY LINKED LIST 
// import java.util.Scanner;
// public class DoublyLinkedList {

//     // Node class
//     static class Node {
//         int data;
//         Node prev;
//         Node next;

//         Node(int data) {
//             this.data = data;
//             this.prev = null;
//             this.next = null;
//         }
//     }

//     static Node head = null;

//     // Insert node at end
//     public static void insertNode(int data) {

//         Node newNode = new Node(data);

//         if (head == null) {
//             head = newNode;
//         } else {

//             Node temp = head;

//             while (temp.next != null) {
//                 temp = temp.next;
//             }

//             temp.next = newNode;
//             newNode.prev = temp;
//         }
//     }

//     // Delete node
//     public static void deleteNode(int key) {

//         if (head == null) {
//             System.out.println("List is empty");
//             return;
//         }

//         Node temp = head;

//         // Delete head node
//         if (head.data == key) {

//             head = head.next;

//             if (head != null) {
//                 head.prev = null;
//             }

//             return;
//         }

//         while (temp != null && temp.data != key) {
//             temp = temp.next;
//         }

//         if (temp == null) {
//             System.out.println("Node not found");
//             return;
//         }

//         if (temp.next != null) {
//             temp.next.prev = temp.prev;
//         }

//         if (temp.prev != null) {
//             temp.prev.next = temp.next;
//         }
//     }

//     // Display list
//     public static void display() {

//         Node temp = head;

//         while (temp != null) {
//             System.out.print(temp.data + " <-> ");
//             temp = temp.next;
//         }

//         System.out.println("null");
//     }

//     public static void main(String[] args) {

//         insertNode(10);
//         insertNode(20);
//         insertNode(30);
//         insertNode(40);

//         System.out.println("Doubly Linked List:");
//         display();

//         deleteNode(20);

//         System.out.println("After deleting 20:");
//         display();
//     }
// }





















// //CIRCULAR LINKED LIST 
// import java.util.Scanner;

// public class CircularLinkedList {

//     // Node class
//     static class Node {
//         int data;
//         Node next;

//         Node(int data) {
//             this.data = data;
//             this.next = null;
//         }
//     }

//     static Node head = null;

//     // Insert node
//     public static void insertNode(int data) {

//         Node newNode = new Node(data);

//         if (head == null) {
//             head = newNode;
//             newNode.next = head;
//         } else {

//             Node temp = head;

//             while (temp.next != head) {
//                 temp = temp.next;
//             }

//             temp.next = newNode;
//             newNode.next = head;
//         }
//     }

//     // Delete node
//     public static void deleteNode(int key) {

//         if (head == null) {
//             System.out.println("List is empty");
//             return;
//         }

//         Node temp = head;
//         Node prev = null;

//         // Delete head node
//         if (head.data == key) {

//             // Single node case
//             if (head.next == head) {
//                 head = null;
//                 return;
//             }

//             Node last = head;

//             while (last.next != head) {
//                 last = last.next;
//             }

//             head = head.next;
//             last.next = head;

//             return;
//         }

//         do {
//             prev = temp;
//             temp = temp.next;

//         } while (temp != head && temp.data != key);

//         if (temp.data != key) {
//             System.out.println("Node not found");
//             return;
//         }

//         prev.next = temp.next;
//     }

//     // Display list
//     public static void display() {

//         if (head == null) {
//             System.out.println("List is empty");
//             return;
//         }

//         Node temp = head;

//         do {
//             System.out.print(temp.data + " -> ");
//             temp = temp.next;
//         } while (temp != head);

//         System.out.println("(head)");
//     }

//     public static void main(String[] args) {

//         insertNode(10);
//         insertNode(20);
//         insertNode(30);
//         insertNode(40);

//         System.out.println("Circular Linked List:");
//         display();

//         deleteNode(20);

//         System.out.println("After deleting 20:");
//         display();
//     }
// }