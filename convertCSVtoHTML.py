# writing to file
outputFile = open('htmlOptions.txt', 'w')
 
# Using readlines()
inputFile = open('proofs.csv', 'r')
Lines = inputFile.readlines()
inputFile.close()

# Initialize
output = []
previousLine0 = -1
previousLine1 = -1
previousLine3 = -1
previousLine4 = -1

previousRays = -1

for line in Lines:
    if ((str(line[0]) == previousLine0) & (str(line[1]) == previousLine1) & (str(line[3]) == previousLine3) & (str(line[4]) == previousLine4)): continue
    previousLine0 = str(line[0])
    previousLine1 = str(line[1])
    previousLine3 = str(line[3])
    previousLine4 = str(line[4])
    
    string = '<option class="solution" value="' + previousLine0+previousLine1+'-'+previousLine3+previousLine4+'">' + previousLine0+previousLine1+'-'+previousLine3+previousLine4+'</option>\n'
    
    output.append(string)

print(output)
outputFile.writelines(output)
outputFile.close()