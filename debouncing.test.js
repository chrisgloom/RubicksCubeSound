


function debounce(func, wait, immediate) {
    var timeout;
  
    return function executedFunction() {
      var context = this;
      var args = arguments;
          
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
  
      var callNow = immediate && !timeout;
      
      clearTimeout(timeout);
  
      timeout = setTimeout(later, wait);
      
      if (callNow) func.apply(context, args);
    };
  }


test("hardcoded debounce test", function(){
    var poop = jest.fn()
    var debouncedPoop = debounce(poop,500,true)
    jest.useFakeTimers()
    debouncedPoop()
    expect(poop).toHaveBeenCalledTimes(1)
    jest.advanceTimersByTime(499)
    // jest.advanceTimersByTime(1)
    debouncedPoop()
    expect(poop).toHaveBeenCalledTimes(1)
    debouncedPoop()
    jest.advanceTimersByTime(2000)
    // jest.runAllTimers()
    debouncedPoop()
    expect(poop).toHaveBeenCalledTimes(2)
})


