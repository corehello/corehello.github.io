Python vs Rust vs Golang - OO 

Python Dunder functions:

```python
class Point:
    def __init__(self, x, y) -> None:
        self.x = x
        self.y = y
    def __repr__(self) -> str:
        return "({}, {})".format(self.x, self.y)
```



Rust Traits:

```rust
use std::fmt;

struct Point<T, U> {
    x: T,
    y: U,
}

impl<T, U> fmt::Display for Point<T, U>
where
    T: fmt::Display,
    U: fmt::Display,
{
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}
```



Golang:

```golang
import "fmt"

// not found any thing to make the customization
// and call like python or Rust
func customizePrint(s interface{}) string {
	return fmt.Println("%v", s)
}
```

