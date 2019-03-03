use std::cmp::min;
use std::collections::HashMap;
use std::collections::HashSet;
use std::fs::File;
use std::io::prelude::*;
use std::io::BufReader;

fn read_file(fname: &str) -> Vec<String> {
    let f = File::open(fname).expect("Unable to open file!");
    let f = BufReader::new(f);
    println!("Reading {}", fname);
    f.lines().map(|l| l.expect("Can't parse line")).collect()
}

static HORIZONTAL: usize = 1234567;

fn write_solution(fname: &str, solution: Vec<&Slide>) {
    let mut f = File::create(fname).expect("Unable to create file!");
    writeln!(f, "{}", solution.len());
    for slide in solution {
        let (id1, id2) = slide.real_ids;
        if id2 == HORIZONTAL {
            writeln!(f, "{}", id1);
        } else {
            writeln!(f, "{} {}", id1, id2);
        }
    }
}

struct Line<'a> {
    is_landscape: bool,
    tags: HashSet<&'a str>,
    id: usize,
}

fn parse_line(line: &str, line_number: usize) -> Line {
    let fields: Vec<&str> = line.split(" ").collect();
    let mut line_iter = fields.into_iter();
    let orientation = line_iter.next().unwrap();
    let _tag_num = line_iter.next().unwrap();
    let tags: HashSet<&str> = line_iter.collect();
    Line {
        is_landscape: orientation == "H",
        tags: tags,
        id: line_number,
    }
}

struct Slide {
    tags: HashSet<usize>,
    id: usize,
    real_ids: (usize, usize),
}

fn score(set1: &HashSet<usize>, set2: &HashSet<usize>) -> usize {
    let s1 = set1.intersection(&set2).count();
    let s2 = set1.difference(&set2).count();
    let s3 = set2.difference(&set1).count();
    min(min(s1, s2), s3)
}

fn main() {
    let lines = read_file("inputs/b_lovely_landscapes.txt");
    let mut lines_iter = lines.iter();
    let line_num = lines_iter.next().unwrap();
    println!("{} lines", line_num);
    let line_vec: Vec<Line> = lines_iter
        .enumerate()
        .map(|(index, t_line)| parse_line(t_line, index))
        .collect();
    println!("Parsed input");

    // Give an integer code to each tag, and use them to create Slides
    let mut tags_to_int: HashMap<&str, usize> = HashMap::new();
    let mut next_tag_id = 0;

    let mut slides: Vec<Slide> = Vec::new();
    for line in line_vec {
        // Doing input B for now, all landscapes
        assert!(line.is_landscape);
        for tag in &line.tags {
            if !tags_to_int.contains_key(tag) {
                tags_to_int.insert(tag, next_tag_id);
                next_tag_id += 1;
            }
        }
        let tag_set: HashSet<usize> = line.tags.iter().map(|tag| tags_to_int[tag]).collect();
        let slide = Slide {
            tags: tag_set,
            id: slides.len(),
            real_ids: (line.id, HORIZONTAL),
        };
        slides.push(slide);
    }

    let mut slides_by_tag: Vec<Vec<usize>> = Vec::new();
    for _ in 0..next_tag_id {
        slides_by_tag.push(Vec::new());
    }
    println!("{} different tags", next_tag_id);
    for slide in &slides {
        for tag in &slide.tags {
            slides_by_tag[*tag].push(slide.id);
        }
    }
    println!("Built tag → slide index map");

    let first_slide = &slides[0]; // Firse slide choice seems to be uninportant?
    let mut greedy_solution: Vec<&Slide> = Vec::new();
    greedy_solution.push(first_slide);
    let mut current_slide = first_slide;
    let mut unused_ids: HashSet<usize> = slides.iter().map(|slide| slide.id).collect();
    unused_ids.remove(&current_slide.id);
    println!("{} unused_ids", unused_ids.len());
    let mut final_score = 0;

    while unused_ids.len() > 0 {
        // Counter from python solution, might useful for other input sets
        /*
        let mut counter: HashMap<usize, usize> = HashMap::new();
        for tag in &current_slide.tags {
            for other_slide_id in &slides_by_tag[*tag] {
                if unused_ids.contains(other_slide_id) {
                    let amount_found = counter.entry(*other_slide_id).or_insert(0);
                    *amount_found += 1;
                }
            }
        } */
        current_slide = {
            let mut potential_nexts = current_slide
                .tags
                .iter()
                .map(|tag| &slides_by_tag[*tag])
                .flatten()
                .filter(|id| unused_ids.contains(*id))
                .peekable();

            if potential_nexts.peek().is_some() {
                let mut best_next = &slides[*potential_nexts.next().unwrap()];
                let mut max_score = score(&best_next.tags, &current_slide.tags);
                let mut min_score_size = best_next.tags.len(); // TODO handle ties
                for slide_id in potential_nexts {
                    let temp_slide = &slides[*slide_id];
                    let temp_score = score(&temp_slide.tags, &current_slide.tags);
                    if (temp_score, min_score_size) > (max_score, temp_slide.tags.len()) {
                        best_next = temp_slide;
                        max_score = temp_score;
                        min_score_size = temp_slide.tags.len();
                    }
                }
                final_score += max_score;
                best_next
            } else {
                let mut ids_iter = unused_ids.iter();
                let best_next = &slides[*ids_iter.next().unwrap()];
                // TODO pick next
                /* let mut min_len = best_next.tags.len();
                for photo_id in ids_iter {
                    let temp_photo = &photos[*photo_id];
                    if temp_photo.tags.len() < min_len {
                        best_next = temp_photo;
                        min_len = temp_photo.tags.len();
                    }
                }*/
                best_next
            }
        };
        unused_ids.remove(&current_slide.id);
        greedy_solution.push(current_slide);
        if unused_ids.len() % 1000 == 0 {
            println!("{}", unused_ids.len())
        }
    }
    println!("Expected score is: {}", final_score);
    write_solution("solutions/b_solution.txt", greedy_solution);
}
