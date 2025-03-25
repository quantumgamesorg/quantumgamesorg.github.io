"use strict";

let content = document.getElementById("content");

let boardContainer = document.getElementById("boardContainer");
const defaultBoardContainerSize = { width: parseInt(getComputedStyle(boardContainer).width), height: parseInt(getComputedStyle(boardContainer).height) };

let circleMap = [];
function setupBoard() {
    makeBoard(boardContainer, [
        [ 1,  2,  3,  4,     5,  6,  7,  8,     9, 10, 11, 12,    13, 14, 15, 16,    17, 18, 19, 20],  
        [21, 22, 23, 24,    25, 26, 27, 28,    29, 30, 31, 32,    33, 34, 35, 36,    37, 38, 39, 40],  
        [41, 42, 43, 44,    45, 46, 47, 48,    49, 50, 51, 52,    53, 54, 55, 56,    57, 58, 59, 60],  

        [ 1,  2, 15, 16,     5,  6, 31, 32,     9, 11, 18, 20,     5,  7, 14, 16,     1,  3, 22, 24],  
        [21, 22, 35, 36,    25, 28, 46, 48,    29, 32, 38, 40,    13, 15, 34, 36,     9, 11, 26, 28],  
        [41, 42, 54, 56,    45, 46, 53, 56,     9, 12, 49, 52,    33, 36, 42, 44,    17, 20, 43, 44], 
        
        [ 3,  4, 25, 26,     7,  8, 17, 18,    19, 20, 29, 30,     5,  7, 34, 36,     1,  4, 42, 43],  
        [21, 24, 47, 48,    26, 27, 57, 58,     6,  7, 49, 51,     9, 12, 38, 39,    17, 20, 54, 56],  
        [42, 44, 58, 59,    22, 23, 54, 55,     9, 10, 23, 24,    13, 14, 27, 28,    37, 38, 55, 56],  

        [ 1,  4, 51, 52,     5,  8, 46, 47,     9, 10, 35, 36,    13, 16, 55, 56,    29, 32, 58, 60],  
        [21, 23, 30, 32,    18, 20, 25, 27,     1,  3, 30, 32,    33, 36, 57, 60,    37, 39, 58, 60],  
        [41, 44, 51, 52,    45, 48, 50, 52,    37, 40, 49, 52,    14, 15, 37, 38,    45, 47, 59, 60],  

        [ 3,  4, 13, 14,     7,  8, 29, 30,    10, 12, 17, 19,     6,  8, 13, 15,     2,  4, 21, 23], 
        [23, 24, 33, 34,    26, 27, 45, 47,    30, 31, 37, 39,    14, 16, 33, 35,    10, 12, 25, 27], 
        [43, 44, 53, 55,    47, 48, 54, 55,    10, 11, 50, 51,    34, 35, 41, 43,    18, 19, 41, 42],  

        [ 1,  2, 27, 28,     5,  6, 19, 20,    17, 18, 31, 32,     6,  8, 33, 35,     2,  3, 41, 44],  
        [22, 23, 45, 46,    25, 28, 59, 60,     5,  8, 50, 52,    10, 11, 37, 40,    18, 19, 53, 55],  
        [41, 43, 57, 60,    21, 24, 53, 56,    11, 12, 21, 22,    15, 16, 25, 26,    39, 40, 53, 54], 
        
        [ 2,  3, 49, 50,     6,  7, 45, 48,    11, 12, 33, 34,    14, 15, 53, 54,    30, 31, 57, 59],  
        [22, 24, 29, 31,    17, 19, 26, 28,     2,  4, 29, 31,    34, 35, 58, 59,    38, 40, 57, 59], 
        [42, 43, 49, 50,    46, 47, 49, 51,    38, 39, 50, 51,    13, 16, 39, 40,    46, 48, 57, 58],  
    ]);
	buildScoreboard(15, 4, true);
}

setupBoard();



var conversions = [
    0, 3, 6, 9, 12, 1, 4, 7, 10, 13, 2, 5, 8, 11, 14, 15, 75, 27, 52, 42, 45, 87, 90, 72, 97, 60, 30, 78, 18, 24, 39, 48, 82, 93, 37, 69, 84, 33, 63, 38, 51, 21, 28, 40, 23, 85, 68, 66, 73, 83, 96, 41, 25, 101, 54, 56, 99, 70, 86, 81, 94, 29, 43, 74, 88, 49, 36, 16, 46, 31, 80, 76, 35, 91, 61, 19, 79, 64,34, 22, 57, 67, 102, 26, 55, 71, 100, 44, 58, 53, 98, 103, 89, 17, 77, 47, 92, 32, 62, 20, 59, 50, 95, 104, 65  
]

var solutions = {
    '18-9' : [6,18,22,53,55,68,71,86,99,],
    '20-11' : [1,4,16,18,20,53,57,68,71,86,94,],
    '21-11' : [1,16,18,20,36,37,55,68,71,84,99,],
    '22-11' : [1,16,27,28,32,36,55,61,63,76,105,],
    '22-13' : [1,4,6,9,16,18,20,53,57,68,73,84,99,],
    '23-13' : [1,4,6,16,18,20,36,37,57,68,73,84,99,],
    '24-13' : [1,4,16,18,20,29,33,36,56,74,80,90,97,],
    '25-13' : [1,16,26,28,33,36,41,45,48,58,62,84,97,],
    '26-13' : [16,17,28,29,34,36,38,55,60,61,63,78,105,],
    '24-15' : [1,4,6,9,11,14,16,18,20,53,57,68,73,84,94,],
    '25-15' : [1,4,6,9,11,16,18,20,36,37,57,68,73,86,99,],
    '26-15' : [1,2,4,8,16,18,20,29,35,36,56,74,82,91,97,],
    '27-15' : [1,16,17,18,24,28,32,36,54,61,63,71,72,78,93,],
    '28-15' : [1,4,6,16,18,20,48,49,52,60,64,69,77,83,95,],
    '29-15' : [16,17,28,29,34,36,38,52,57,59,60,61,63,76,100,],
    '30-15' : [16,17,28,29,34,36,39,54,61,63,78,80,82,88,105,],
    '29-17' : [1,6,16,17,18,22,26,41,43,49,50,53,57,59,73,86,99,],
    '30-17' : [1,16,17,18,22,26,28,30,36,38,60,61,62,74,79,81,95,],
    '31-17' : [1,2,16,17,18,24,31,36,42,44,50,54,66,75,77,85,92,],
    '32-17' : [1,2,16,26,31,36,42,44,51,58,60,63,68,71,74,80,93,],
    '33-17' : [16,17,19,20,26,28,29,30,32,34,36,61,62,78,83,98,104,],
    '34-17' : [16,17,28,29,34,36,39,48,49,54,62,76,80,82,88,99,100,],
    '32-19' : [1,7,8,16,17,18,22,26,28,30,36,38,60,61,62,74,77,83,95,],
    '33-19' : [1,4,16,17,18,19,20,22,28,32,36,57,61,62,69,71,72,78,94,],
    '34-19' : [1,2,6,16,17,18,22,26,31,36,58,60,62,66,69,77,83,85,86,],
    '35-19' : [1,2,3,4,6,16,18,20,29,38,42,49,52,62,69,76,83,98,104,],
    '36-19' : [16,17,26,27,28,29,30,31,34,36,39,67,72,74,75,76,79,81,85,],
    '37-19' : [16,17,28,29,30,32,34,36,40,44,48,52,62,69,70,82,88,99,100,],
    '38-19' : [16,17,26,27,28,29,34,36,38,50,51,58,61,66,70,74,81,87,101,],
    '34-21' : [1,2,4,5,16,17,18,19,20,22,28,34,36,57,61,64,69,70,73,78,99,],
    '35-21' : [1,4,16,17,18,19,20,22,24,25,29,32,36,57,61,62,67,71,72,78,94,],
    '36-21' : [1,2,4,16,17,18,19,20,22,31,36,43,44,50,56,69,75,79,84,89,95,],
    '37-21' : [1,2,16,17,18,24,31,36,52,58,70,73,84,87,88,89,91,94,96,101,102,],
    '38-21' : [16,17,19,20,27,28,29,30,32,34,36,52,60,61,64,67,76,78,79,81,95,],
    '39-21' : [16,17,26,27,28,29,30,31,34,36,38,41,43,47,48,49,60,62,86,96,102,],
    '40-21' : [16,17,22,23,24,25,28,29,34,35,36,37,54,61,62,70,75,78,80,86,91,],
    '41-21' : [16,17,26,27,28,29,30,32,34,36,40,44,49,61,62,69,70,82,88,99,100,],
    '42-21' : [16,17,26,27,28,29,34,36,38,40,42,48,51,58,69,70,77,78,82,87,89,],
    '37-23' : [1,2,4,5,7,16,17,18,19,20,22,28,34,36,57,61,64,69,70,72,76,99,105,],
    '38-23' : [1,2,4,5,16,17,18,19,20,22,28,34,36,48,49,56,64,69,71,72,76,88,99,],
    '39-23' : [1,2,4,5,16,17,18,19,20,22,31,36,42,44,50,56,61,69,75,79,84,89,95,],
    '40-23' : [1,2,3,16,26,31,36,40,51,58,68,69,74,80,83,88,90,94,95,97,101,102,105,],
    '41-23' : [16,17,18,19,22,25,26,28,29,30,31,34,35,36,37,43,45,51,67,68,70,78,96,],
    '42-23' : [16,17,28,29,32,33,34,35,36,37,38,39,41,45,48,54,66,76,80,83,85,91,101,],
    '43-23' : [16,17,18,20,26,28,29,30,31,34,36,38,41,44,48,66,74,76,80,86,93,94,100,],
    '44-23' : [16,17,28,29,34,35,36,37,41,44,49,53,56,57,59,61,63,69,70,75,82,100,103,],
    '45-23' : [16,17,26,27,28,29,30,32,34,36,40,44,48,62,69,70,77,79,83,88,89,99,100,],
    '46-23' : [16,17,26,27,28,29,34,36,38,40,42,48,51,58,69,71,76,79,82,86,89,95,100,],
    '39-25' : [1,16,17,18,19,20,22,23,25,26,28,30,36,39,40,45,48,60,66,72,77,95,98,102,104,],
    '40-25' : [1,2,3,4,10,16,17,18,19,20,22,28,34,36,43,48,56,62,69,71,72,79,93,94,104,],
    '41-25' : [1,2,3,16,26,31,36,40,51,58,60,63,64,67,68,69,74,88,90,92,95,97,101,102,105,],
    '42-25' : [16,17,18,19,23,24,26,28,29,30,31,34,35,36,37,40,41,47,48,51,60,66,69,72,76,],
    '43-25' : [16,17,18,19,22,24,26,28,29,30,31,34,35,36,37,41,45,48,60,66,69,72,75,76,96,],
    '44-25' : [16,17,18,20,26,28,29,30,31,34,35,36,37,38,39,47,48,51,66,68,69,72,74,76,97,],
    '45-25' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,44,48,66,68,76,82,86,88,99,100,],
    '46-25' : [16,17,18,20,26,28,29,30,31,34,35,36,37,40,43,48,50,62,69,78,83,84,87,103,104,],
    '47-25' : [16,17,26,27,28,29,30,31,34,35,36,37,41,44,48,62,73,74,75,76,78,80,93,99,103,],
    '48-25' : [16,17,26,27,28,29,30,31,34,36,38,40,42,48,51,69,71,77,78,82,85,88,92,93,105,],
    '49-25' : [16,17,26,27,28,29,30,32,34,36,40,45,48,62,69,70,77,79,82,90,93,94,95,98,100,],
    '50-25' : [16,17,26,27,28,29,34,36,38,40,42,48,51,58,69,71,77,78,82,86,88,92,93,95,105,],
    '42-27' : [1,2,4,5,14,16,17,18,19,20,22,31,36,42,44,50,56,61,69,75,78,84,89,95,100,104,105,],
    '43-27' : [16,17,19,21,26,28,29,30,31,34,36,38,41,44,46,48,49,51,56,58,59,66,76,78,82,90,103,],
    '44-27' : [16,17,18,19,26,27,28,29,30,31,34,36,38,40,41,48,49,61,62,64,72,76,77,83,84,85,86,],
    '45-27' : [16,17,18,19,22,24,26,28,29,30,31,34,35,36,37,40,41,46,48,51,60,66,69,72,76,90,96,],
    '46-27' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,46,48,50,61,62,65,78,82,86,93,105,],
    '47-27' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,46,48,51,66,68,76,82,84,93,94,100,],
    '48-27' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,46,48,50,66,76,82,87,93,94,98,100,],
    '49-27' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,44,48,66,68,76,83,87,88,89,95,99,100,],
    '50-27' : [16,17,18,20,26,28,29,30,31,34,35,36,37,40,43,48,50,62,69,79,82,84,87,90,91,92,102,],
    '51-27' : [16,17,26,27,28,29,30,31,34,35,36,37,40,44,48,62,69,71,76,78,83,84,86,92,93,94,103,],
    '52-27' : [16,17,26,27,28,29,30,31,34,36,38,40,42,48,51,69,70,77,78,82,84,88,92,93,94,95,99,],
    '53-27' : [16,17,18,20,26,28,29,34,35,36,37,40,43,48,50,58,62,69,79,82,88,92,93,98,100,103,105,],
    '54-27' : [16,17,26,27,28,29,34,36,38,40,42,48,51,58,69,71,76,79,82,86,90,91,92,96,97,98,100,],
    '44-29' : [1,2,4,13,14,16,17,18,19,20,22,31,36,42,44,50,56,61,63,64,69,75,78,85,89,99,102,103,104,],
    '45-29' : [16,17,18,21,26,28,29,30,31,32,33,34,35,36,37,41,42,43,45,48,61,66,67,69,70,74,75,76,102,],
    '46-29' : [16,17,18,19,23,24,26,28,29,30,31,34,35,36,37,38,39,41,42,43,45,48,70,74,75,79,102,103,104,],
    '47-29' : [16,17,18,19,22,24,26,28,29,30,31,34,35,36,37,38,39,41,44,48,66,70,74,75,76,91,96,102,103,],
    '48-29' : [16,17,18,20,26,28,29,30,31,32,33,34,35,36,37,38,39,41,45,48,66,72,75,77,81,83,97,103,104,],
    '49-29' : [16,17,26,27,28,29,30,31,32,33,34,35,36,37,38,39,41,45,49,60,61,63,72,74,75,82,88,91,105,],
    '50-29' : [16,17,18,21,26,28,29,30,31,34,35,36,37,50,51,61,63,68,72,73,74,78,81,97,98,99,100,101,102,],
    '51-29' : [16,17,22,23,24,25,28,29,30,31,34,35,36,37,41,45,48,52,62,70,75,81,89,90,93,94,97,100,103,],
    '52-29' : [16,17,18,20,26,28,29,30,31,32,33,34,35,36,37,40,43,48,50,62,69,78,82,84,87,90,91,92,104,],
    '53-29' : [16,17,26,27,28,29,30,31,34,35,36,37,40,45,48,62,69,70,76,79,82,84,86,88,91,94,102,104,105,],
    '54-29' : [16,17,26,27,28,29,30,31,34,36,38,40,42,48,50,68,69,71,76,79,82,86,90,91,92,96,97,98,100,],
    '55-29' : [16,17,26,27,28,29,30,31,34,36,38,40,42,48,51,69,71,77,78,82,85,90,91,92,94,96,97,99,105,],
    '56-29' : [16,17,26,27,28,29,34,36,38,40,42,48,50,58,68,69,71,77,78,82,85,90,91,92,94,96,97,99,105,],
    '47-31' : [16,17,18,19,22,24,26,28,29,30,31,34,35,36,37,43,45,48,49,51,60,61,62,64,68,69,70,76,97,102,103,],
    '48-31' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,42,43,46,48,51,56,57,68,78,82,84,88,93,94,105,],
    '49-31' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,42,43,46,48,51,56,57,68,79,83,84,92,94,100,104,],
    '50-31' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,42,43,46,48,51,68,78,80,81,82,84,88,89,94,105,],
    '51-31' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,42,43,46,48,51,68,78,83,84,89,93,94,100,101,104,],
    '52-31' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,46,48,50,66,76,78,79,82,86,88,89,92,99,100,101,],
    '53-31' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,46,48,50,66,76,82,87,88,90,91,94,98,102,103,105,],
    '54-31' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,47,48,50,66,76,83,87,89,90,93,94,95,96,97,100,],
    '55-31' : [16,17,18,19,26,27,28,29,30,31,34,36,38,40,41,42,44,46,48,73,76,79,83,87,90,91,94,96,97,99,100,],
    '56-31' : [16,17,18,19,26,27,28,29,30,31,34,36,38,40,42,48,50,68,73,76,79,82,87,90,91,92,94,96,97,99,100,],
    '57-31' : [16,17,26,27,28,29,30,31,34,36,38,40,41,46,48,50,64,67,69,74,77,79,87,88,91,93,95,97,100,103,105,],
    '50-33' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,46,48,51,56,58,59,60,62,70,74,76,78,80,82,89,95,104,],
    '51-33' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,42,43,46,48,51,56,57,68,76,77,78,83,84,92,94,100,101,],
    '52-33' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,42,43,46,48,51,56,57,68,78,82,84,89,92,94,100,101,104,],
    '53-33' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,42,43,46,48,51,68,76,77,78,82,84,88,89,92,94,104,105,],
    '54-33' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,42,43,46,48,51,68,78,83,84,88,92,96,97,99,100,102,103,],
    '55-33' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,46,48,50,61,63,64,78,83,87,88,89,90,91,95,96,97,105,],
    '56-33' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,46,48,50,66,76,82,87,88,89,92,94,95,96,97,102,103,105,],
    '57-33' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,41,42,48,51,56,58,59,70,73,77,79,83,89,91,94,97,99,100,103,],
    '58-33' : [16,17,18,19,26,27,28,29,30,31,34,36,38,40,42,48,50,68,72,77,78,80,81,82,87,90,91,94,96,97,99,100,105,],
    '52-35' : [16,17,18,19,22,24,26,28,29,30,31,34,35,36,37,40,41,43,44,48,49,51,60,61,62,64,70,74,76,80,82,90,97,102,103,],
    '53-35' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,42,43,46,48,51,56,57,68,76,77,78,80,81,82,84,89,94,100,101,],
    '54-35' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,42,43,46,48,51,68,78,80,81,82,84,88,89,95,98,99,100,101,104,],
    '55-35' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,42,43,46,48,51,68,78,80,81,82,84,89,90,91,93,94,100,102,103,],
    '56-35' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,42,43,46,48,51,68,78,80,81,82,84,88,89,96,97,99,100,102,103,],
    '57-35' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,42,43,46,48,51,68,78,83,84,88,89,90,91,95,98,99,100,102,103,],
    '58-35' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,46,48,50,66,76,78,79,82,84,85,87,88,90,91,96,97,99,100,101,],
    '59-35' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,41,42,48,51,56,58,59,71,73,76,78,80,81,83,88,91,93,95,97,98,103,],
    '55-37' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,42,43,46,48,51,62,63,68,76,77,78,80,81,82,84,88,89,94,99,100,101,],
    '56-37' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,42,43,46,48,51,56,57,68,76,77,78,83,84,92,96,97,99,101,102,103,105,],
    '57-37' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,42,43,46,48,51,56,57,68,78,82,84,89,92,94,95,96,97,98,100,102,103,],
    '58-37' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,42,43,46,48,51,68,76,77,78,82,84,88,89,92,96,97,99,100,102,103,104,],
    '59-37' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,42,43,46,48,51,68,76,77,78,80,81,83,84,90,91,93,96,97,99,104,105,],
    '60-37' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,41,43,46,48,49,66,71,73,78,80,81,82,84,85,87,92,93,96,97,99,100,102,103,],
    '58-39' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,42,43,46,48,51,56,57,68,76,77,78,80,81,82,84,89,96,97,99,101,102,103,105,],
    '59-39' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,42,43,46,48,51,56,57,68,78,80,81,83,84,88,90,91,93,95,98,99,100,102,103,],
    '60-39' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,42,43,46,48,51,62,63,68,76,77,79,80,81,83,84,90,91,93,94,99,102,103,105,],
    '60-41' : [16,17,18,19,22,24,26,28,29,30,31,34,36,38,40,41,42,43,46,48,51,62,63,68,70,71,76,77,79,80,81,82,84,88,90,91,92,94,99,102,103
    ],
}

function solve(size) {
    reset();

    if (size == '-') {return;}

    let solution = solutions[size];

    // the basis index order in the DOM is like
    //  0   3   6   9  12
    //  1   4   7  10  13
    //  2   5   8  11  14
    // ------------------
    // 15  18 etc
    // 16  19
    // 17  20
    // but the numbers above treat it like
    //  0  15  30  45  60
    //  1  16  31  46  61
    //  2  17  32  47  62
    // ------------------
    //  3  18 etc
    //  4  19
    //  5  20



    for(var i in solution){
        document.querySelectorAll(".basis")[conversions[(solution[i]-1)]].click();
    }

}
