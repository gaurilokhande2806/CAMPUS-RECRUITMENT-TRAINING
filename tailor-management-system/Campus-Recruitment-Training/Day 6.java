import java.util.Scanner;

public class Queue {

    static int size = 5;
    static int[] queue = new int[size];
    static int front = -1;
    static int rear = -1;

    // Check Overflow
    public static boolean overflow() {
        return ((rear + 1) % size == front);
    }

    // Check Underflow
    public static boolean underflow() {
        return (front == -1);
    }

    // Enqueue Operation
    public static void enqueue(int value) {
        if (overflow()) {
            System.out.println("Queue Overflow");
            return;
        }

        if (front == -1) { // First element
            front = 0;
            rear = 0;
        } else {
            rear = (rear + 1) % size;
        }                                                                                                                                      
        queue[rear] = value;
        System.out.println(value + " inserted.");
    }

    // Dequeue Operation
    public static void dequeue() {
        if (underflow()) {
            System.out.println("Queue Underflow");
            return;
        }

        int deleted = queue[front];

        if (front == rear) { // Only one element
            front = -1;
            rear = -1;
        } else {
            front = (front + 1) % size;
        }

        System.out.println(deleted + " deleted.");
    }

    // Display Queue
    public static void display() {
        if (underflow()) {
            System.out.println("Queue is Empty");
            return;
        }

        System.out.print("Queue Elements: ");

        int i = front;

        while (true) {
            System.out.print(queue[i] + " ");

            if (i == rear)
                break;

            i = (i + 1) % size;
        }

        System.out.println();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int choice;

        do {
            System.out.println("\nMenu");
            System.out.println("1. Enqueue");
            System.out.println("2. Dequeue");
            System.out.println("3. Display");
            System.out.println("4. Exit");
            System.out.print("Enter your choice: ");

            choice = sc.nextInt();

            switch (choice) {

                case 1:
                    System.out.print("Enter Element: ");
                    int value = sc.nextInt();
                    enqueue(value);
                    break;

                case 2:
                    dequeue();
                    break;

                case 3:
                    display();
                    break;

                case 4:
                    System.out.println("Exiting...");
                    break;

                default:
                    System.out.println("Invalid Choice");
            }

        } while (choice != 4);

        sc.close();
    }
}