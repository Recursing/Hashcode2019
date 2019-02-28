from collections import Counter, defaultdict


def read_lines(fname):
    with open(fname, "r") as in_file:
        lines = in_file.readlines()
    print("Read {} lines from {}".format(len(lines), fname))
    return lines


def write_solution(fname, solution, real_ids):
    assert len(set(solution)) == len(solution)
    with open(fname, "w") as out_file:
        out_file.write(str(len(solution)) + "\n")
        out_file.writelines(" ".join(map(str, real_ids[i])) + "\n" for i in solution)
    print("Written {} lines to {}".format(len(solution), fname))


input_files = [
    # "a_example.txt",
    # "b_lovely_landscapes.txt",
    "c_memorable_moments.txt",
    # "d_pet_pictures.txt",
    # "e_shiny_selfies.txt",
]


def score(set1, set2):
    return min(len(set1 & set2), len(set1 - set2), len(set2 - set1))


for ifile in input_files:
    lines = read_lines(ifile)

    landscape_photos = []
    tag_landscapes = defaultdict(list)
    merged_photos = []
    last_vertical = []
    landscape_id = 0
    real_ids = {}

    verticals = []
    for real_id, line in enumerate(lines[1:]):
        split_line = line.strip().split(" ")
        orientation, ntags = split_line[:2]
        tags = split_line[2:]
        tags = set(tags)
        ids = (real_id,)
        if orientation == "V":
            verticals.append((tags, real_id))
            continue
        landscape_photos.append((tags, landscape_id))
        for tag in tags:
            tag_landscapes[tag].append(landscape_id)
        real_ids[landscape_id] = ids
        landscape_id += 1

    verticals.sort(key=lambda x: len(x[0]))
    while verticals:
        (tags, real_id) = verticals[0]
        other_verticals = verticals[1:]
        union = lambda x: len(x[0] | tags) - len(x[0] & tags)
        other_vertical = max(other_verticals, key=union)
        other_tags, other_real_id = other_vertical
        tags = other_tags | tags
        ids = real_id, other_real_id
        landscape_photos.append((tags, landscape_id))
        for tag in tags:
            tag_landscapes[tag].append(landscape_id)
        real_ids[landscape_id] = ids
        landscape_id += 1
        other_verticals.remove(other_vertical)
        verticals = other_verticals
        print(len(verticals))

    print("Parsed {}".format(ifile))
    first_photo = max(landscape_photos, key=lambda x: len(x[0]))
    solution = [first_photo[1]]
    used = set([first_photo[1]])
    last_photo = first_photo
    unused_ids = set(range(len(landscape_photos))) - used
    while len(used) != len(landscape_photos):
        counter = Counter(
            p_id
            for tag in last_photo[0]
            for p_id in tag_landscapes[tag]
            if p_id not in used
        )
        potential_nexts = [p_id[0] for p_id in counter.most_common(100)]
        if not potential_nexts:
            last_photo = max(
                (landscape_photos[p_id] for p_id in unused_ids), key=lambda x: len(x[0])
            )
        else:
            par_score = lambda x: score(last_photo[0], x[0])
            potential_nexts.sort(key=lambda x: len(landscape_photos[x][0]))
            last_photo = max(
                (landscape_photos[p] for p in potential_nexts), key=par_score
            )
        solution.append(last_photo[1])
        used.add(last_photo[1])
        unused_ids.remove(last_photo[1])
        if len(used) % 100 == 0:
            print(len(used))

    write_solution(ifile + "_solution.txt", solution, real_ids)
