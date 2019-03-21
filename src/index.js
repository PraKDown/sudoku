module.exports = function solveSudoku(matrix) {
  function check(matrix) {
    function check_el(el) {
      let sum = 0;
      for (let i = 0; i < el.length; i++) {
        if(el[i] == 0) {
          sum++;
        }
      }
      let fail = 0;
      if (sum > 0) fail = sum - 1; 
      if([... new Set(el)].length != el.length - fail) return -1;
      return sum;
    }
  
    let sum = 0;
    let dop = []
    for (let j = 0; j < 9; j++) {
      for (let i = 0; i < 9; i++) {
        dop.push(matrix[i][j])
      }
      if (check_el(dop) == -1) return -1;
      dop = [];
    }
  
    sum = 0;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        dop.push(matrix[i][j])
      }
      if (check_el(dop) == -1) return -1;
      dop = [];
    }
  
    for (let i = 0; i < 9; i = i + 3) {
      for (let j = 0; j < 9; j = j + 3) {
        for (let k = i; k < i + 3; k ++) {
          for (let l = j; l < j + 3; l ++) {
            dop.push(matrix[k][l]);
          }      
        }
        if (check_el(dop) == -1) return -1;
        sum = sum + check_el(dop);
        dop = [];
      }
    }
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        if (matrix[i][j]==0) {
          if(first_step(i, j, matrix).length == 0) return -1;
        }
      }
    }
    return sum;
  }
  
  function first_step(n, m, matrix){
    let sample = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < sample.length; j++) {
        if(matrix[n][i] == sample[j]){
          sample.splice(j, 1);
          break;
        }
      }
    }
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < sample.length; j++) {
        if(matrix[i][m] == sample[j]) {
          sample.splice(j, 1);
          break;
        }
      }
    }
    function get_par(k) {
      if (k < 3) return 0;
      if (k >= 3 && k < 6) return 3;
      if (k >= 6 && k < 9) return 6;
    }
    n = get_par(n);
    m = get_par(m);
    for (let i = n; i < n + 3; i++) {
      for (let j = m; j< m + 3; j++) {
        for (let k = 0; k < sample.length; k++) {
          if(matrix[i][j] == sample[k]){
            sample.splice(k, 1);
            break;
          }
        }
      }
    }
    return sample;
  }
  
  function second_step(n, m, matrix) {
    let first_array = first_step(n, m, matrix);
    let second_array = [];
    for (let j = 0; j < 9; j++) {
      if(m != j) {
        if(matrix[n][j] == 0){
          second_array = first_step(n, j, matrix);
          for (let l = 0; l < second_array.length; l++) {
            for (let k = 0; k < first_array.length; k++) {
              if (second_array[l] == first_array[k]) {
                first_array.splice(k, 1);
                break;
              }
            }
          }
        } 
      }
    }
    for (let i = 0; i < 9; i++) {
      if(n != i) {
        if(matrix[i][m] == 0){
          second_array = first_step(i, m, matrix);
          for (let l = 0; l < second_array.length; l++) {
            for (let k = 0; k < first_array.length; k++) {
              if (second_array[l] == first_array[k]) {
                first_array.splice(k, 1);
                break;
              }
            }
          }
        } 
      }
    }
    function get_par(k) {
      if (k < 3) return 0;
      if (k >= 3 && k < 6) return 3;
      if (k >= 6 && k < 9) return 6;
    }
    a = get_par(n);
    b = get_par(m);
    for (let i = a; i < a + 3; i++) {
      for (let j = b; j< b + 3; j++) {
        if(i != n && j != m) {
          if(matrix[i][j] == 0){
            second_array = first_step(i, j, matrix);
            for (let l = 0; l < second_array.length; l++) {
              for (let k = 0; k < first_array.length; k++) {
                if (second_array[l] == first_array[k]) {
                  first_array.splice(k, 1);
                  break;
                }
              }
            }
          } 
        }
      }
    }
    return first_array;
  }
  
  function medium(matrix) {
    let array_step = [];
    let el = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if(matrix[i][j] == 0) {
          el = first_step(i, j, matrix);
          if(el.length == 1){
            matrix[i][j]=el[0];
            medium(matrix);
          }
          el = second_step(i, j, matrix);
          if(el.length == 1){
            matrix[i][j]=el[0];
            medium(matrix);
          }
        }
      } 
    }
  }
  
  function hard(matrix) {
    if(check(matrix) > 0) perem = medium(matrix);
    if(check(matrix) == 0) return matrix;
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] == 0) { 
          matrix[i][j] = first_step(i, j, matrix);
          for (let l = 0; l < matrix[i][j].length; l++) { 
						let array_step = [];
						for (let k = 0; k < matrix.length; k++) {
							array_step[k] = matrix[k].slice(); 
						}
            array_step[i][j] = matrix[i][j][l];
            if(check(array_step) > 0) perem = medium(array_step);
            if(check(array_step) == -1) { if (l == matrix[i][j].length - 1) { return "error" } continue;}
            if(check(array_step) == 0) return array_step;
            if(check(array_step) > 0) return hard(array_step);
          }
        }
      }
    }
  
  }
  
	return hard(matrix);
}
