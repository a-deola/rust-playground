fn main() {
    // println!("Hello, world!");
    // loop_label();
    // reverse_array();
    println!("{:?}", running_sum(vec![1, 1, 1, 1, 1]))
}
fn loop_label() {
    let mut count = 0;
    'counting_up: loop {
        println!("count = {count}");
        let mut remaining = 10;

        loop {
            println!("remaining = {remaining}");
            if remaining == 9 {
                break;
            }
            if count == 2 {
                break 'counting_up;
            }
            remaining -= 1;
        }

        count += 1;
    }
    println!("End count = {count}");
}
fn reverse_array() {
    let mut array = [1, 2, 3, 4];

    array.reverse();
    println!("reversed array: {:?}", array);
}
fn running_sum(mut nums: Vec<i32>) -> Vec<i32> {
    let mut sum = 0;
    for i in 0..nums.len() {
        sum += nums[i];
        nums[i] = sum;
    }
    nums
}
