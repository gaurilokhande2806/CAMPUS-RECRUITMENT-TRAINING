// import java.util.*;

// public class Tree {

//     static class Node {
//         int data;
//         Node left, right;

//         Node(int data) {
//             this.data = data;
//             left = right = null;
//         }
//     }

//     Node root;

//     // Insert using level order
//     public void insert(int data) {
//         Node newNode = new Node(data);

//         if (root == null) {
//             root = newNode;
//             return;
//         }

//         Queue<Node> q = new LinkedList<>();
//         q.add(root);

//         while (!q.isEmpty()) {
//             Node temp = q.poll();

//             if (temp.left == null) {
//                 temp.left = newNode;
//                 return;
//             } else {
//                 q.add(temp.left);
//             }

//             if (temp.right == null) {
//                 temp.right = newNode;
//                 return;
//             } else {
//                 q.add(temp.right);
//             }
//         }
//     }

//     // Inorder Traversal
//     public void inorder(Node root) {
//         if (root == null)
//             return;

//         inorder(root.left);
//         System.out.print(root.data + " ");
//         inorder(root.right);
//     }

//     // Preorder Traversal
//     public void preorder(Node root) {
//         if (root == null)
//             return;

//         System.out.print(root.data + " ");
//         preorder(root.left);
//         preorder(root.right);
//     }

//     // Postorder Traversal
//     public void postorder(Node root) {
//         if (root == null)
//             return;

//         postorder(root.left);
//         postorder(root.right);
//         System.out.print(root.data + " ");
//     }

//     public void bfs(Node root) {

//         if (root == null) return;
//         Queue<Node> q = new LinkedList<>();
//         q.add(root);
//         while (!q.isEmpty()) {

//             Node temp = q.poll();

//             System.out.print(temp.data + " ");

//             if (temp.left != null) {
//                 q.add(temp.left);
//             }

//             if (temp.right != null) {
//                 q.add(temp.right);
//             }
//         }
//     }


//     public void dfs(Node root){
//         if(root==null) return;
//         Stack<Node> s = new Stack<>();
        
//         s.push(root);
//         while(!s.isEmpty()){
//             Node temp = s.pop();
//             System.out.print(temp.data +  " ,");
//             if(temp.right != null){
//                 s.push(temp.right);
//             }
//             if(temp.left!= null){
//                 s.push(temp.left);
//             }
//         }

//     }

//     public static void main(String[] args) {
//         Scanner sc = new Scanner(System.in);
//         Tree t = new Tree();

//         int choice;

//         do {
//             System.out.println("\n1. Insert");
//             System.out.println("2. Inorder");
//             System.out.println("3. Preorder");
//             System.out.println("4. Postorder");
//             System.out.println("5. BFS traversal");
//             System.out.println("6. DFS traversal");
//             System.out.println("7. Exit");
//             System.out.print("Enter your choice: ");

//             choice = sc.nextInt();

//             switch (choice) {
//                 case 1:
//                     System.out.print("Enter data: ");
//                     int data = sc.nextInt();
//                     t.insert(data);
//                     break;

//                 case 2:
//                     System.out.print("Inorder: ");
//                     t.inorder(t.root);
//                     System.out.println();
//                     break;

//                 case 3:
//                     System.out.print("Preorder: ");
//                     t.preorder(t.root);
//                     System.out.println();
//                     break;

//                 case 4:
//                     System.out.print("Postorder: ");
//                     t.postorder(t.root);
//                     System.out.println();
//                     break;

                
//                 case 5:
//                     System.out.print("Breadth first search : ");
//                     t.bfs(t.root);
//                     System.out.println();
//                     break;

//                 case 6:
//                     System.out.print("Depth first search : ");
//                     t.dfs(t.root);
//                     System.out.println();
//                     break;

//                 case 7:
//                     System.out.println("Exiting...");
//                     break;

//                 default:
//                     System.out.println("Invalid Choice!");
//             }

//         } while (choice != 5);

//         sc.close();
//     }
// }













// #include<stdio.h>
// void main(){
//     if(500){
//         printf("Swanand kulkarni");
//     }
// }




// #include<stdio.h>
// void main(){
//     if(-200){
//         printf("Swanand kulkarni");
//     }
// }




// #include<stdio.h>
// void main(){
//     if(0){
//         printf("Swanand kulkarni");
//     }
// }





// #include<stdio.h>
// int fact(int n){
//     return n * fact(n-1);
// }
// int main(){
//     printf("%d", fact(5));
//     return 0;
// }




// #include<io.stream>

// int main(){
//     int x=10;
//     int $y =x;
//     y++;
//     cout << x;
//     return 0;
// }



// responsive website 
// Responsive website design is an approach where web pages dynamically adjust their layout,
//  images, and text to fit perfectly on any screen size or device.






// Accenture Coding Question 1
// Coding Question 1
// The function def differenceofSum(n. m) accepts two integers n, m as arguments Find the sum of all numbers in range from 1 to m(both inclusive) that are not divisible by n. Return difference between sum of integers not divisible by n with sum of numbers divisible by n.

// Assumption:

// n>0 and m>0
// Sum lies between integral range
// Example

// Input
// n:4
// m:20
// Output
// 90

// Explanation

// Sum of numbers divisible by 4 are 4 + 8 + 12 + 16 + 20 = 60
// Sum of numbers not divisible by 4 are 1 +2 + 3 + 5 + 6 + 7 + 9 + 10 + 11 + 13 + 14 + 15 + 17 + 18 + 19 = 150
// Difference 150 – 60 = 90
// Sample Input
// n:3
// m:10
// Sample Output



import java.util.*;
class Solution 
{
    public static int differenceOfSum (int m, int n) 
    {
        int sum1 = 0, sum2 = 0;
        for (int i = 1; i <= m; i++)
        {
            if (i % n == 0)
                sum1 = sum1 + i;
    	    else    
                sum2 = sum2 + i;
        }
        return Math.abs (sum1 - sum2);
    }
public static void main (String[]args)
{
Scanner sc = new Scanner (System.in);
int n = sc.nextInt ();
int m = sc.nextInt ();
System.out.println (differenceOfSum (m, n));
}
}