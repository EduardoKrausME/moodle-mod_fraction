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
 * Backup task for mod_fraction.
 *
 * @package   mod_fraction
 * @copyright 2026 Eduardo Kraus {@link https://eduardokraus.com}
 * @license   https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once(__DIR__ . "/backup_fraction_stepslib.php");

class backup_fraction_activity_task extends backup_activity_task {
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
        $this->add_step(new backup_fraction_activity_structure_step("fraction_structure", "fraction.xml"));
    }

    /**
     * Method encode_content_links.
     *
     * @param mixed $content Parameter content.
     * @return string Return value.
     */
    public static function encode_content_links($content): string {
        global $CFG;

        return preg_replace(
            "#(" . preg_quote($CFG->wwwroot, "#") . ")/mod/fraction/view.php\\?id=([0-9]+)#",
            '$@FRACTIONVIEWBYID*$2@$',
            $content
        );
    }
}
