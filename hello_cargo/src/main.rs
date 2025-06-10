fn main() {
    fn plus_one(x: Option<i32>) -> Option<i32> {
        match x {
            None => None,
            Some(i) => Some(i + 1),
        }
    }

    let five = Some(5);
    let six = plus_one(five);
    let none = plus_one(None);
}

// fn divide(a: f64, b: f64) -> Option<f64> {
//     if b == 0.0 { None } else { Some(a / b) }
// }

// fn main() {
//     match divide(10.0, 2.0) {
//         Some(res) => println!("Result = {}", res),
//         None      => println!("Cannot divide by zero"),
//     }
// }
