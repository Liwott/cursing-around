# cursing-around package

A package for multiple cursor management.
Loosely inspired by [multi-cursor](https://github.com/joseramonc/multi-cursor), the main differences feature-wise being :
- symmetry between the use of buffer and screen coordinates
- symmetry between the four directions (hence the `around`)

The status is very embryonic.
Before the package being usable, I need at least `cursing-around-screen:move-cursors-up` to be functionally equivalent to `core:move-up`.