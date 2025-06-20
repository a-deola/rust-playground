fn main() {
    fizz_buzz();
    println!("Hello, world!");
}
fn fizz_buzz() {
    let mut count = 0;
    for i in 0..301 {
        if i % 3 == 0 && i % 5 == 0 {
            println!("fizz buzz");
            count += 1
        } else if i % 3 == 0 {
            println!("fizz");
        } else if i % 5 == 0 {
            println!("buzz");
        }
    }
    println!("{}", count)
}
