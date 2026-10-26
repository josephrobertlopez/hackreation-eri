<?php
// php starters/ai-helpers/php/hello_llm.php
// Reads one SYNTHETIC service note and asks the LLM which DVR milestone it documents.
require __DIR__ . '/llm.php';
$f = fopen(__DIR__ . '/../../../data/dvr/service_notes.csv', 'r');
$head = fgetcsv($f, null, ',', '"', '');
$note = null;
while (($r = fgetcsv($f, null, ',', '"', '')) !== false) {
    $row = array_combine($head, $r);
    if ($row['hire_date'] !== '') { $note = $row; break; }
}
$system = file_get_contents(__DIR__ . '/../prompts/classify-service-note.md');
echo "Hello, ERI! Classifying note {$note['note_id']}...\n";
echo llm($system, json_encode($note)) . "\n";
