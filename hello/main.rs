fn main() {
    println!("Hello, world!");
    loop_label();
    reverse_array();
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
    // add your code herein
    println!("reversed array: {:?}", array);
}
