// import { LinkedList, Node } from "./linkedLists";
class Node {
    constructor(value = null) {
      this.value = value;
      this.nextNode = null;
    }
}
  
class LinkedList {
    constructor() {
      this.head = null;
      this.tail = null;
      this.size = 0;
    }
  
    append(value) {
      const newNode = new Node(value);
      if (this.size === 0) {
        this.head = newNode;
        this.tail = newNode;
      } else {
        this.tail.nextNode = newNode;
        this.tail = newNode;
      }
      this.size++;
    }
  
    prepend(value) {
      const newNode = new Node(value);
      if (this.size === 0) {
        this.head = newNode;
        this.tail = newNode;
      } else {
        newNode.nextNode = this.head;
        this.head = newNode;
      }
      this.size++;
    }
  
    getSize() {
      return this.size;
    }
  
    head() {
      return this.head;
    }
  
    tail() {
      return this.tail;
    }
  
    at(index) {
      if (index < 0 || index >= this.size) {
        return null;
      }
  
      let currentNode = this.head;

      for (let i = 0; i < index; i++) {
        currentNode = currentNode.nextNode;
      }
      
      return currentNode;
    }
  
    pop() {
      if (this.size === 0) {
        return null;
      }
  
      let poppedNode;
  
      if (this.size === 1) {
        poppedNode = this.head;
        this.head = null;
        this.tail = null;
      } else {
        let currentNode = this.head;
        while (currentNode.nextNode !== this.tail) {
          currentNode = currentNode.nextNode;
        }
        poppedNode = this.tail;
        currentNode.nextNode = null;
        this.tail = currentNode;
      }
      this.size--;
      return poppedNode;
    }
  
    contains(value) {
      let currentNode = this.head;
      while (currentNode !== null) {
        if (currentNode.value.key === value) {
          return true;
        }
        currentNode = currentNode.nextNode;
      }
      return false;
    }
  
    find(value) {
      let currentNode = this.head;
      let index = 0;
  
      while (currentNode !== null) {
        if (currentNode.value.key === value) {
          return index;
        }
        currentNode = currentNode.nextNode;
        index++;
      }
      return null;
    }
  
    toString() {
      let currentNode = this.head;
      let result = "";
  
      while (currentNode !== null) {
        result += `( ${currentNode.value} ) --> `;
        currentNode = currentNode.nextNode;
      }
      result += "null";
      return result;
    }
  
    insertAt(value, index) {
  
      let newNode = new Node(value);
      // if inserting at front / index of 0 
      if (index === 0) {
          newNode.nextNode = this.head;
          this.head = newNode;
          // if list was previously empty, update tail
          if (this.size === 0) {
              this.tail = newNode;
          }
          this.size++;
          return true;
      }
      // if inserting elsewhere
      let prevNode = this.at(index-1);
      let nextNode = this.at(index);
      prevNode.nextNode = newNode;
      newNode.nextNode = nextNode;
  
      //if inserting at the end
      if (index === this.size) {
          this.tail = newNode;
      }
  
      this.size++;
      return true;
    }
  
    removeAt(index) {
      // if index is the head
      if (index === 0) {
          this.head = this.head.nextNode;
          // if the list has just 1 item left, update tail
          if (this.size === 1) {
              this.tail = null;
          }
          this.size--;
          return true;
      }
      let prevNode = this.at(index-1);
      let nextNode = this.at(index+1); // if nextNode is null, then prevNode is tail
      prevNode.nextNode = nextNode;
  
      if (nextNode === null) {
          this.tail = prevNode;
      }
      this.size--;
      return true;
    }
  
}
  

class HashMap {
    constructor(loadFactor, capacity) {
        this.loadFactor = loadFactor;
        this.capacity = capacity;
        this.buckets = new Array(this.capacity); // creates array of # buckets
        this.size = 0;
    }

    hash(key) {
        let hashCode = 0;
        const primeNumber = 31;
        for (let i = 0; i < key.length; i++) {
            hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.capacity;
        }
        return hashCode;
    }

    set(key, value) {
        let hashCode = this.hash(key);
    
        // Check if key already exists, if so, just update the value and return early
        if (this.has(key)) {
            // If key exists, update the value
            let bucket = this.buckets[hashCode];
            let foundNodeIndex = bucket.find(key);
            if (foundNodeIndex !== null) {
                let foundNode = bucket.at(foundNodeIndex);
                foundNode.value.value = value; // update value if key exists
            }
            return; // return early to avoid unnecessary rehashing
        }
    
        // Check if the capacity is reached and if the current size requires rehashing
        if (this.size >= this.loadFactor * this.capacity) {
            this.capacity *= 2; // Double the capacity
            let oldBuckets = this.buckets;
            this.buckets = new Array(this.capacity); // Reinitialize the buckets
    
            // Rehash all entries from old buckets to new ones
            for (let i = 0; i < oldBuckets.length; i++) {
                if (oldBuckets[i]) {
                    let currentNode = oldBuckets[i].head;
                    while (currentNode != null) {
                        let newHashCode = this.hash(currentNode.value.key); // Rehash key
                        if (!this.buckets[newHashCode]) {
                            this.buckets[newHashCode] = new LinkedList();
                        }
                        this.buckets[newHashCode].append(currentNode.value); // Reinsert the node
                        currentNode = currentNode.nextNode;
                    }
                }
            }
        }
    
        // After rehashing or if no rehashing was needed, proceed to insert the new key-value pair
        if (!this.buckets[hashCode]) {
            this.buckets[hashCode] = new LinkedList();
        }
        this.buckets[hashCode].append({ key: key, value: value });
        this.size++;
    }

    // set(key, value) {
    //     let hashCode = this.hash(key);

    //     // check to see if need to double array if capacity is reached and trying to hash
    //     // something that does not exist 
    //     if (this.size >= this.loadFactor*this.capacity) {
    //         if (!this.has(key)) {
    //             this.capacity *= 2;
    //             let oldBuckets = this.buckets;
    //             this.buckets = new Array(this.capacity);
    
    //             for (let i=0; i < oldBuckets.length; i++) {
    //                 if (oldBuckets[i]) {
    //                     let currentNode = oldBuckets[i].head;
    //                     while (currentNode != null) {
    //                         let hashCode = this.hash(currentNode.value.key);
    //                         if (!this.buckets[hashCode]) {
    //                             this.buckets[hashCode] = new LinkedList();
    //                         }
    //                         this.buckets[hashCode].append(currentNode.value);
    //                         currentNode = currentNode.nextNode;
    //                     }
    //                 }
    //             }
    //         }
    //     }

    //     // if bucket does not exist, initialize linked list
    //     if (!this.buckets[hashCode]) {
    //         this.buckets[hashCode] = new LinkedList();
    //     }
    //     // if key already exists, update the value 
    //     // within hashCode bucket, return the linkedList index where key in {key, value} is found 
    //     let foundNode = this.buckets[hashCode].find(value.key);
    //     if (foundNode) {
    //         foundNode.value.value = value; // update value in {key, value} if existing Node with key already in linkedList
    //     } else {
    //         // if key does not exist, add new Node with {key, value} to Linked list
    //         this.buckets[hashCode].append({ key: key, value: value });
    //         this.size++;
    //     }
    // }

    // returns the value that is assigned to this key
    get(key) {
        let hashCode = this.hash(key);
        let foundNode = this.buckets[hashCode].find(key.key);
        if (foundNode) {
            return foundNode.value.value;
        }
        return null;
    }

    // returns true or false based on whether or not the key is in the hash map
    has(key) {
        let hashCode = this.hash(key);

        if (!this.buckets[hashCode]) {
            return false;
        }

        let bucket = this.buckets[hashCode];
        if (bucket.contains(key)) {
            return true;
        }
        return false;
    }

    // If the given key is in the hash map, it should remove the entry with that key and return true
    // If the key isn’t in the hash map, it should return false
    remove(key) {
        if (this.has(key)) {
            let hashCode = this.hash(key);
            let foundNodeIndex = this.buckets[hashCode].find(key.key);
            this.buckets[hashCode].removeAt(foundNodeIndex);
            this.size--;
            return true;
        }
        return false;
    }

    length() {
        return this.size;
    }

    clear() {
        this.buckets = new Array(this.capacity);
    }

    // returns an array containing all the keys inside the hash map.
    keys() {
        let listOfKeys = [];
        // go through each bucket and get all keys in the linked lists and combine them together into an array
        for (let i=0; i < this.buckets.length; i++) {
            // if there is a bucket
            if (this.buckets[i]) {
                let currentNode = this.buckets[i].head;

                while (currentNode != null) {
                    listOfKeys.push(currentNode.value.key);
                    currentNode = currentNode.nextNode;
                }
            }
        }
        return listOfKeys;
    }

    // returns an array containing all the values
    values() {
        let listOfValues = [];
        // go through each bucket and get all keys in the linked lists and combine them together into an array
        for (let i=0; i < this.buckets.length; i++) {
            // if there is a bucket
            if (this.buckets[i]) {
                let currentNode = this.buckets[i].head;

                while (currentNode != null) {
                    listOfKeys.push(currentNode.value.value);
                    currentNode = currentNode.nextNode;
                }
            }
        }
        return listOfValues;
    }

    // returns an array that contains each key, value pair
    entries() {
        let allEntries = [];

        for (let i=0; i < this.buckets.length; i++) {

            if (this.buckets[i]) {
                let currentNode = this.buckets[i].head;

                while (currentNode != null) {
                    allEntries.push(currentNode.value);
                    currentNode = currentNode.nextNode;
                }
            }
        }
        return allEntries;

    }

}