
def read_lines(fname):
    with open(fname, 'r') as in_file:
        lines = in_file.readlines()
    print(f"Read {len(lines)} lines from {fname}")
    return lines


input_files = ["a_example.txt",
"b_lovely_landscapes.txt",
"c_memorable_moments.txt",
"d_pet_pictures.txt",
"e_shiny_selfies.txt"]

for ifile in input_files:
    lines = read_lines(ifile)
    for line in lines[1:]:
        orientation, ntags, *tags = line.split(' ')
