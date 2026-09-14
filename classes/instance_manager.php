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

namespace mod_fraction;

/**
 * Handles activity instance persistence.
 *
 * @package   mod_fraction
 * @copyright 2026 Eduardo Kraus {@link https://eduardokraus.com}
 * @license   https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class instance_manager {
    /**
     * Creates an activity instance.
     *
     * @param \stdClass $data Activity data.
     * @return int
     */
    public static function add(\stdClass $data): int {
        global $DB;

        $now = time();
        $data->timecreated = $now;
        $data->timemodified = $now;

        return $DB->insert_record("fraction", $data);
    }

    /**
     * Updates an activity instance.
     *
     * @param \stdClass $data Activity data.
     * @return bool
     */
    public static function update(\stdClass $data): bool {
        global $DB;

        $data->id = $data->instance;
        $data->timemodified = time();

        return $DB->update_record("fraction", $data);
    }

    /**
     * Deletes an activity instance.
     *
     * @param int $id Instance id.
     * @return bool
     */
    public static function delete(int $id): bool {
        global $DB;

        if (!$DB->record_exists("fraction", ["id" => $id])) {
            return false;
        }

        $DB->delete_records("fraction", ["id" => $id]);
        return true;
    }
}
