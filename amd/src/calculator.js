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
 * calculator.js
 *
 * @package   mod_fraction
 * @copyright 2026 Eduardo Kraus {@link https://eduardokraus.com}
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define(["jquery"], function($) {
    "use strict";

    const integerValue = function(root, field) {
        const raw = root.find('[data-field="' + field + '"]').val();
        if (raw === "" || !/^-?\d+$/.test(String(raw).trim())) {
            return null;
        }
        return Number.parseInt(raw, 10);
    };

    const normalise = function(numerator, denominator) {
        if (denominator < 0) {
            return {numerator: -numerator, denominator: -denominator, changed: true};
        }
        return {numerator: numerator, denominator: denominator, changed: false};
    };

    const gcdWithSteps = function(a, b) {
        let left = Math.abs(a);
        let right = Math.abs(b);
        const steps = [];

        if (left === 0 && right === 0) {
            return {value: 0, steps: steps};
        }

        while (right !== 0) {
            const quotient = Math.floor(left / right);
            const remainder = left % right;
            steps.push(left + " = " + right + " × " + quotient + " + " + remainder);
            left = right;
            right = remainder;
        }

        return {value: left, steps: steps};
    };

    const lcmWithSteps = function(a, b) {
        const gcd = gcdWithSteps(a, b);
        const value = Math.abs(a * b) / gcd.value;
        return {
            value: value,
            gcd: gcd,
            formula: string("lcmformula") + "(" + Math.abs(a) + ", " + Math.abs(b) + ") = |" + a + " × " + b + "| ÷ " + gcd.value + " = " + value,
        };
    };

    const simplifyFraction = function(numerator, denominator) {
        const normalised = normalise(numerator, denominator);
        const gcd = gcdWithSteps(normalised.numerator, normalised.denominator);
        const divisor = gcd.value || 1;
        return {
            numerator: normalised.numerator / divisor,
            denominator: normalised.denominator / divisor,
            divisor: divisor,
            gcd: gcd,
            signchanged: normalised.changed,
        };
    };

    const fractionText = function(numerator, denominator) {
        return numerator + "/" + denominator;
    };

    const string = function(key, a) {
        return M.util.get_string(key, "fraction", a);
    };

    const resultHtml = function(answer, steps, extraClass) {
        let html = '<div class="fraction-answer ' + (extraClass || "") + '"><span>' +
            escapeHtml(string("result")) + ':</span><span class="fraction-answer-value">' + escapeHtml(answer) + "</span></div>";
        if (steps.length) {
            html += '<div class="fraction-steps-title">' + escapeHtml(string("steps")) + ':<\/div><ol class="fraction-steps">';
            steps.forEach(function(step) {
                html += "<li>" + escapeHtml(step) + "</li>";
            });
            html += "</ol>";
        }
        return html;
    };

    const errorHtml = function(message) {
        return '<div class="fraction-error">' + escapeHtml(message) + "</div>";
    };

    const escapeHtml = function(value) {
        return $("<div>").text(String(value)).html();
    };

    const validateFraction = function(numerator, denominator) {
        if (numerator === null || denominator === null) {
            return string("enterfraction");
        }
        if (denominator === 0) {
            return string("denominatorzero");
        }
        return null;
    };

    const gcdStepsToText = function(gcd) {
        const steps = [string("gcdtitle") + ":"];
        gcd.steps.forEach(function(step) {
            steps.push(step);
        });
        steps.push(string("gcdstep") + ": " + gcd.value);
        return steps;
    };

    const calculateSimplify = function(root) {
        const numerator = integerValue(root, "simplify-numerator");
        const denominator = integerValue(root, "simplify-denominator");
        const result = root.find('[data-result="simplify"]');
        const error = validateFraction(numerator, denominator);

        if (error) {
            result.html(errorHtml(error));
            return;
        }

        const simplified = simplifyFraction(numerator, denominator);
        let steps = [];
        if (simplified.signchanged) {
            steps.push(string("signnormalization") + ": " + fractionText(numerator, denominator) + " = " +
                fractionText(-numerator, -denominator));
        }
        steps = steps.concat(gcdStepsToText(simplified.gcd));

        if (simplified.divisor === 1) {
            steps.push(string("alreadysimplified") + ": " + fractionText(simplified.numerator, simplified.denominator));
        } else {
            const normalisedNumerator = simplified.signchanged ? -numerator : numerator;
            const normalisedDenominator = simplified.signchanged ? -denominator : denominator;
            steps.push(string("simplifystep") + ": (" + normalisedNumerator + " ÷ " + simplified.divisor + ") / (" +
                normalisedDenominator + " ÷ " + simplified.divisor + ") = " +
                fractionText(simplified.numerator, simplified.denominator));
        }
        steps.push(string("finalresult") + ": " + fractionText(simplified.numerator, simplified.denominator));
        result.html(resultHtml(fractionText(simplified.numerator, simplified.denominator), steps));
    };

    const calculateCompare = function(root) {
        const an = integerValue(root, "compare-a-numerator");
        const ad = integerValue(root, "compare-a-denominator");
        const bn = integerValue(root, "compare-b-numerator");
        const bd = integerValue(root, "compare-b-denominator");
        const result = root.find('[data-result="compare"]');
        const error = validateFraction(an, ad) || validateFraction(bn, bd);

        if (error) {
            root.find('[data-region="compare-symbol"]').text("?");
            result.html(errorHtml(error));
            return;
        }

        const a = normalise(an, ad);
        const b = normalise(bn, bd);
        const left = a.numerator * b.denominator;
        const right = b.numerator * a.denominator;
        let symbol = "=";
        let relation = string("equalto");
        if (left > right) {
            symbol = ">";
            relation = string("greaterthan");
        } else if (left < right) {
            symbol = "<";
            relation = string("lessthan");
        }
        root.find('[data-region="compare-symbol"]').text(symbol);

        const lcm = lcmWithSteps(a.denominator, b.denominator);
        const aFactor = lcm.value / a.denominator;
        const bFactor = lcm.value / b.denominator;
        const aEquivalent = a.numerator * aFactor;
        const bEquivalent = b.numerator * bFactor;
        const steps = [
            string("crossmultiply") + ": " + a.numerator + " × " + b.denominator + " = " + left +
                " " + string("and") + " " + b.numerator + " × " + a.denominator + " = " + right,
            string("comparisonresult") + ": " + left + " " + symbol + " " + right,
            string("lcmtitle") + ": " + lcm.formula,
            string("equivalent") + ": " + fractionText(a.numerator, a.denominator) + " = " +
                fractionText(aEquivalent, lcm.value) + "; " + fractionText(b.numerator, b.denominator) + " = " +
                fractionText(bEquivalent, lcm.value),
            string("finalresult") + ": " + fractionText(a.numerator, a.denominator) + " " + relation + " " +
                fractionText(b.numerator, b.denominator),
        ];
        result.html(resultHtml(fractionText(a.numerator, a.denominator) + " " + symbol + " " +
            fractionText(b.numerator, b.denominator), steps));
    };

    const calculateAddSubtract = function(root) {
        const an = integerValue(root, "addsub-a-numerator");
        const ad = integerValue(root, "addsub-a-denominator");
        const bn = integerValue(root, "addsub-b-numerator");
        const bd = integerValue(root, "addsub-b-denominator");
        const result = root.find('[data-result="addsubtract"]');
        const error = validateFraction(an, ad) || validateFraction(bn, bd);

        if (error) {
            result.html(errorHtml(error));
            return;
        }

        const a = normalise(an, ad);
        const b = normalise(bn, bd);
        const operation = root.find('[data-tool="addsubtract"] [data-operation].active').data("operation") || "add";
        const symbol = operation === "subtract" ? "−" : "+";
        root.find('[data-region="addsub-symbol"]').text(symbol);

        const lcm = lcmWithSteps(a.denominator, b.denominator);
        const aFactor = lcm.value / a.denominator;
        const bFactor = lcm.value / b.denominator;
        const aEquivalent = a.numerator * aFactor;
        const bEquivalent = b.numerator * bFactor;
        const rawNumerator = operation === "subtract" ? aEquivalent - bEquivalent : aEquivalent + bEquivalent;
        const simplified = simplifyFraction(rawNumerator, lcm.value);
        const steps = [
            string("gcdtitle") + ": " + lcm.gcd.steps.join("; ") + (lcm.gcd.steps.length ? "; " : "") +
                string("gcdstep") + ": " + lcm.gcd.value,
            string("lcmtitle") + ": " + lcm.formula,
            string("convertfractions") + ": " + fractionText(a.numerator, a.denominator) + " × " + aFactor + "/" + aFactor +
                " = " + fractionText(aEquivalent, lcm.value) + "; " + fractionText(b.numerator, b.denominator) + " × " +
                bFactor + "/" + bFactor + " = " + fractionText(bEquivalent, lcm.value),
            (operation === "subtract" ? string("subtractnumerators") : string("addnumerators")) + ": (" +
                aEquivalent + " " + symbol + " " + bEquivalent + ") / " + lcm.value + " = " +
                fractionText(rawNumerator, lcm.value),
        ];
        steps.push(string("gcdtitle") + " " + fractionText(rawNumerator, lcm.value) + ": " +
            (simplified.gcd.steps.length ? simplified.gcd.steps.join("; ") + "; " : "") + string("gcdstep") + ": " + simplified.divisor);
        if (simplified.divisor !== 1) {
            steps.push(string("simplifystep") + ": (" + rawNumerator + " ÷ " + simplified.divisor + ") / (" +
                lcm.value + " ÷ " + simplified.divisor + ") = " + fractionText(simplified.numerator, simplified.denominator));
        } else {
            steps.push(string("alreadysimplified") + ": " + fractionText(simplified.numerator, simplified.denominator));
        }
        steps.push(string("finalresult") + ": " + fractionText(simplified.numerator, simplified.denominator));

        result.html(resultHtml(fractionText(simplified.numerator, simplified.denominator), steps));
    };

    const calculateMultiplyDivide = function(root) {
        const an = integerValue(root, "muldiv-a-numerator");
        const ad = integerValue(root, "muldiv-a-denominator");
        const bn = integerValue(root, "muldiv-b-numerator");
        const bd = integerValue(root, "muldiv-b-denominator");
        const result = root.find('[data-result="multiplydivide"]');
        const error = validateFraction(an, ad) || validateFraction(bn, bd);

        if (error) {
            result.html(errorHtml(error));
            return;
        }

        const a = normalise(an, ad);
        const b = normalise(bn, bd);
        const operation = root.find('[data-tool="multiplydivide"] [data-operation].active').data("operation") || "multiply";
        let secondNumerator = b.numerator;
        let secondDenominator = b.denominator;
        const steps = [];

        if (operation === "divide") {
            root.find('[data-region="muldiv-symbol"]').text("÷");
            if (b.numerator === 0) {
                result.html(errorHtml(string("cannotdividebyzero")));
                return;
            }
            steps.push(string("reciprocal") + ": " + fractionText(b.numerator, b.denominator) + " → " +
                fractionText(b.denominator, b.numerator));
            secondNumerator = b.denominator;
            secondDenominator = b.numerator;
            steps.push(string("divisionasmultiplication") + ": " + fractionText(a.numerator, a.denominator) + " ÷ " +
                fractionText(b.numerator, b.denominator) + " = " + fractionText(a.numerator, a.denominator) + " × " +
                fractionText(secondNumerator, secondDenominator));
        } else {
            root.find('[data-region="muldiv-symbol"]').text("×");
        }

        const rawNumerator = a.numerator * secondNumerator;
        const rawDenominator = a.denominator * secondDenominator;
        const simplified = simplifyFraction(rawNumerator, rawDenominator);
        steps.push(string("multiplynumerators") + ": " + a.numerator + " × " + secondNumerator + " = " + rawNumerator);
        steps.push(string("multiplydenominators") + ": " + a.denominator + " × " + secondDenominator + " = " + rawDenominator);
        steps.push(string("operationresult") + ": " + fractionText(rawNumerator, rawDenominator));
        steps.push(string("gcdtitle") + ": " + (simplified.gcd.steps.length ? simplified.gcd.steps.join("; ") + "; " : "") +
            string("gcdstep") + ": " + simplified.divisor);
        if (simplified.divisor !== 1) {
            const normalisedRaw = normalise(rawNumerator, rawDenominator);
            steps.push(string("simplifystep") + ": (" + normalisedRaw.numerator + " ÷ " + simplified.divisor + ") / (" +
                normalisedRaw.denominator + " ÷ " + simplified.divisor + ") = " + fractionText(simplified.numerator, simplified.denominator));
        } else {
            steps.push(string("alreadysimplified") + ": " + fractionText(simplified.numerator, simplified.denominator));
        }
        steps.push(string("finalresult") + ": " + fractionText(simplified.numerator, simplified.denominator));
        result.html(resultHtml(fractionText(simplified.numerator, simplified.denominator), steps));
    };

    const divisionExpansion = function(numerator, denominator, maxDigits) {
        const negative = (numerator < 0) !== (denominator < 0);
        let dividend = Math.abs(numerator);
        const divisor = Math.abs(denominator);
        const integerPart = Math.floor(dividend / divisor);
        let remainder = dividend % divisor;
        let digits = "";
        const steps = [];
        const seen = {};
        let repeatAt = -1;

        steps.push(dividend + " ÷ " + divisor + " = " + integerPart + ", " + string("remainder") + " " + remainder);
        for (let i = 0; i < maxDigits && remainder !== 0; i++) {
            if (Object.prototype.hasOwnProperty.call(seen, remainder)) {
                repeatAt = seen[remainder];
                break;
            }
            seen[remainder] = i;
            const before = remainder;
            remainder *= 10;
            const digit = Math.floor(remainder / divisor);
            const newRemainder = remainder % divisor;
            steps.push(before + " × 10 = " + remainder + "; " + remainder + " ÷ " + divisor + " = " + digit +
                ", " + string("remainder") + " " + newRemainder);
            digits += String(digit);
            remainder = newRemainder;
        }

        let decimal = String(integerPart);
        const decimalSeparator = string("decimalseparator");
        if (digits.length) {
            if (repeatAt >= 0) {
                decimal += decimalSeparator + digits.substring(0, repeatAt) + "(" + digits.substring(repeatAt) + ")";
            } else {
                decimal += decimalSeparator + digits + (remainder !== 0 ? "…" : "");
            }
        }
        if (negative && decimal !== "0") {
            decimal = "-" + decimal;
        }
        return {value: decimal, steps: steps};
    };

    const calculateFractionToDecimal = function(root) {
        const numerator = integerValue(root, "convert-fraction-numerator");
        const denominator = integerValue(root, "convert-fraction-denominator");
        const result = root.find('[data-result="fractiontodecimal"]');
        const error = validateFraction(numerator, denominator);

        if (error) {
            result.html(errorHtml(error));
            return;
        }

        const division = divisionExpansion(numerator, denominator, 20);
        const steps = [string("decimaldivision") + ": " + numerator + " ÷ " + denominator];
        division.steps.forEach(function(step) {
            steps.push(step);
        });
        steps.push(string("decimalresult") + ": " + division.value);
        result.html(resultHtml(division.value, steps));
    };

    const parseDecimal = function(raw) {
        const value = String(raw).trim().replace(",", ".");
        if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value)) {
            return null;
        }
        const negative = value.startsWith("-");
        const unsigned = value.replace(/^[+-]/, "");
        const parts = unsigned.split(".");
        const integerPart = parts[0] || "0";
        const decimalPart = parts[1] || "";
        const denominator = Math.pow(10, decimalPart.length);
        const numerator = Number.parseInt(integerPart + decimalPart, 10) * (negative ? -1 : 1);
        const decimalSeparator = string("decimalseparator");
        return {
            numerator: numerator,
            denominator: denominator,
            digits: decimalPart.length,
            normalised: (negative ? "-" : "") + integerPart + (decimalPart.length ? decimalSeparator + decimalPart : ""),
        };
    };

    const calculateDecimalToFraction = function(root) {
        const raw = root.find('[data-field="convert-decimal"]').val();
        const result = root.find('[data-result="decimaltofraction"]');
        const parsed = parseDecimal(raw);
        if (!parsed) {
            result.html(errorHtml(string("enterdecimal")));
            return;
        }

        const simplified = simplifyFraction(parsed.numerator, parsed.denominator);
        const steps = [];
        if (parsed.digits === 0) {
            steps.push(string("decimaltofractionstep") + ": " + parsed.normalised + " = " + parsed.numerator + "/1");
        } else {
            steps.push(string("decimaltofractionstep") + ": " + parsed.normalised + " = " + parsed.numerator + "/" + parsed.denominator);
            steps.push(string("decimalplacesrule", parsed.digits));
        }
        steps.push(string("gcdtitle") + ": " + (simplified.gcd.steps.length ? simplified.gcd.steps.join("; ") + "; " : "") +
            string("gcdstep") + ": " + simplified.divisor);
        if (simplified.divisor !== 1) {
            steps.push(string("simplifystep") + ": (" + parsed.numerator + " ÷ " + simplified.divisor + ") / (" +
                parsed.denominator + " ÷ " + simplified.divisor + ") = " + fractionText(simplified.numerator, simplified.denominator));
        } else {
            steps.push(string("alreadysimplified") + ": " + fractionText(simplified.numerator, simplified.denominator));
        }
        steps.push(string("fractionresult") + ": " + fractionText(simplified.numerator, simplified.denominator));
        result.html(resultHtml(fractionText(simplified.numerator, simplified.denominator), steps));
    };

    const calculateAll = function(root) {
        calculateSimplify(root);
        calculateCompare(root);
        calculateAddSubtract(root);
        calculateMultiplyDivide(root);
        calculateFractionToDecimal(root);
        calculateDecimalToFraction(root);
    };

    const init = function(config) {
        const root = $("#" + config.rootId);
        if (!root.length) {
            return;
        }

        root.on("input change", "input", function() {
            calculateAll(root);
        });

        root.on("click", "[data-operation]", function() {
            const button = $(this);
            button.closest(".fraction-operation-tabs").find("[data-operation]").removeClass("active");
            button.addClass("active");
            calculateAll(root);
        });

        calculateAll(root);
    };

    return {init: init};
});
