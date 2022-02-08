# writing to file
outputFile = open('output.txt', 'w')
 
# Using readlines()
inputFile = open('proofs.csv', 'r')
Lines = inputFile.readlines()
inputFile.close()


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
    string = "'" + str(line[0]) + str(line[1]) + "-" + str(line[3]) + str(line[4]) + "' : ["
    for i in range(125):
        if ((line[i+6] == "0") & (line[i+5] == ',')): string += "],\n"; break
        string += str(line[i + 6])
        if (i == 124): string += "],\n"
    output.append(string)

print(output)
outputFile.writelines(output)
outputFile.close()