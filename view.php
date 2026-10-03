<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Main view for mod_fraction.
 *
 * @package   mod_fraction
 * @copyright 2026 Eduardo Kraus {@link https://eduardokraus.com}
 * @license   https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once(__DIR__ . "/../../config.php");

$id = required_param("id", PARAM_INT);

$cm = get_coursemodule_from_id("fraction", $id, 0, false, MUST_EXIST);
$course = get_course($cm->course);
$fraction = $DB->get_record("fraction", ["id" => $cm->instance], "*", MUST_EXIST);

require_login($course, true, $cm);
$context = context_module::instance($cm->id);
require_capability("mod/fraction:view", $context);

$PAGE->set_url("/mod/fraction/view.php", ["id" => $cm->id]);
$PAGE->set_title(format_string($fraction->name));
$PAGE->set_heading(format_string($course->fullname));
$PAGE->set_context($context);

$event = \mod_fraction\event\course_module_viewed::create([
    "objectid" => $fraction->id,
    "context" => $context,
]);
$event->add_record_snapshot("course", $course);
$event->add_record_snapshot("course_modules", $cm);
$event->add_record_snapshot("fraction", $fraction);
$event->trigger();

$completion = new completion_info($course);
$completion->set_module_viewed($cm);

$stringkeys = [
    "invalidfraction", "denominatorzero", "enterfraction", "enterdecimal", "result", "steps",
    "gcdtitle", "lcmtitle", "simplified", "alreadysimplified", "equivalent", "greaterthan", "lessthan",
    "equalto", "crossmultiply", "commondenominator", "convertfractions", "addnumerators", "subtractnumerators",
    "multiplynumerators", "multiplydenominators", "reciprocal", "divisionasmultiplication", "decimaldivision",
    "decimaltofractionstep", "signnormalization", "finalresult", "cannotdividebyzero", "comparisonresult",
    "operationresult", "decimalresult", "fractionresult", "gcdstep", "lcmstep", "simplifystep", "decimalplacesrule",
    "lcmformula", "and", "remainder", "decimalseparator",
];
$PAGE->requires->strings_for_js($stringkeys, "fraction");
$PAGE->requires->js_call_amd("mod_fraction/calculator", "init", [["rootId" => "mod-fraction-calculator"]]);

$templatecontext = [
    "rootid" => "mod-fraction-calculator",
    "simplify" => get_string("simplify", "fraction"),
    "compare" => get_string("compare", "fraction"),
    "addsubtract" => get_string("addsubtract", "fraction"),
    "multiplydivide" => get_string("multiplydivide", "fraction"),
    "convert" => get_string("convert", "fraction"),
    "numerator" => get_string("numerator", "fraction"),
    "denominator" => get_string("denominator", "fraction"),
    "fractiona" => get_string("fractiona", "fraction"),
    "fractionb" => get_string("fractionb", "fraction"),
    "add" => get_string("add", "fraction"),
    "subtract" => get_string("subtract", "fraction"),
    "multiply" => get_string("multiply", "fraction"),
    "divide" => get_string("divide", "fraction"),
    "fractiontodecimal" => get_string("fractiontodecimal", "fraction"),
    "decimaltofraction" => get_string("decimaltofraction", "fraction"),
    "decimal" => get_string("decimal", "fraction"),
    "calculateautomatically" => get_string("calculateautomatically", "fraction"),
];

echo $OUTPUT->header();

if (trim($fraction->intro ?? "") !== "") {
    echo $OUTPUT->box(format_module_intro("fraction", $fraction, $cm->id), "generalbox mod_introbox");
}

echo $OUTPUT->render_from_template("mod_fraction/calculator", $templatecontext);
echo $OUTPUT->footer();
