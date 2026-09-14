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
 * Core callbacks for mod_fraction.
 *
 * @package   mod_fraction
 * @copyright 2026 Eduardo Kraus {@link https://eduardokraus.com}
 * @license   https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Returns supported Moodle features.
 *
 * @param string $feature Feature constant.
 * @return mixed
 */
function fraction_supports(string $feature) {
    return match ($feature) {
        FEATURE_MOD_INTRO => true,
        FEATURE_SHOW_DESCRIPTION => true,
        FEATURE_COMPLETION_TRACKS_VIEWS => true,
        FEATURE_BACKUP_MOODLE2 => true,
        FEATURE_MOD_PURPOSE => MOD_PURPOSE_CONTENT,
        default => null,
    };
}

/**
 * Adds an activity instance.
 *
 * @param stdClass $data Activity data.
 * @param mod_fraction_mod_form|null $mform Form instance.
 * @return int
 */
function fraction_add_instance(stdClass $data, ?mod_fraction_mod_form $mform = null): int {
    return \mod_fraction\instance_manager::add($data);
}

/**
 * Updates an activity instance.
 *
 * @param stdClass $data Activity data.
 * @param mod_fraction_mod_form|null $mform Form instance.
 * @return bool
 */
function fraction_update_instance(stdClass $data, ?mod_fraction_mod_form $mform = null): bool {
    return \mod_fraction\instance_manager::update($data);
}

/**
 * Deletes an activity instance.
 *
 * @param int $id Instance id.
 * @return bool
 */
function fraction_delete_instance(int $id): bool {
    return \mod_fraction\instance_manager::delete($id);
}
