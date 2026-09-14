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
 * Restore task for mod_fraction.
 *
 * @package   mod_fraction
 * @copyright 2026 Eduardo Kraus {@link https://eduardokraus.com}
 * @license   https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Class restore_fraction_activity_task
 */
class restore_fraction_activity_task extends restore_activity_task {
    /**
     * Method define_my_settings.
     *
     * @return void Return value.
     */
    protected function define_my_settings(): void {
    }

    /**
     * Method define_my_steps.
     *
     * @return void Return value.
     */
    protected function define_my_steps(): void {
        $this->add_step(new restore_fraction_activity_structure_step("fraction_structure", "fraction.xml"));
    }

    /**
     * Method define_decode_contents.
     *
     * @return array Return value.
     */
    public static function define_decode_contents(): array {
        return [
            new restore_decode_rule("FRACTIONVIEWBYID", "/mod/fraction/view.php?id=$1", "course_module"),
        ];
    }

    /**
     * Method define_restore_log_rules.
     *
     * @return array Return value.
     */
    public static function define_restore_log_rules(): array {
        return [];
    }
}
