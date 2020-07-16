﻿/**
 * Jdenticon
 * https://github.com/dmester/jdenticon
 * Copyright © Daniel Mester Pirttijärvi
 */

import { toCss3Color } from "../color";

/**
 * Renderer redirecting drawing commands to a canvas context.
 */
export class CanvasRenderer {
    /**
     * @param {number=} size
     */
    constructor(ctx, size) {
        const width = ctx.canvas.width,
              height = ctx.canvas.height;
        
        ctx.save();
        
        this._ctx = ctx;
        
        if (size) {
            this.size = size;
        }
        else {
            this.size = Math.min(width, height);
            
            ctx.translate(
                ((width - this.size) / 2) | 0,
                ((height - this.size) / 2) | 0);
        }
        
        ctx.clearRect(0, 0, this.size, this.size);
    }

    /**
     * Fills the background with the specified color.
     * @param {string} fillColor  Fill color on the format #rrggbb[aa].
     */
    setBackground(fillColor) {
        const ctx = this._ctx,
              size = this.size;

        ctx.fillStyle = toCss3Color(fillColor);
        ctx.fillRect(0, 0, size, size);
    }

    /**
     * Marks the beginning of a new shape of the specified color. Should be ended with a call to endShape.
     * @param {string} fillColor Fill color on format #rrggbb[aa].
     */
    beginShape(fillColor) {
        const ctx = this._ctx;
        ctx.fillStyle = toCss3Color(fillColor);
        ctx.beginPath();
    }

    /**
     * Marks the end of the currently drawn shape. This causes the queued paths to be rendered on the canvas.
     */
    endShape() {
        this._ctx.fill();
    }

    /**
     * Adds a polygon to the rendering queue.
     * @param points An array of Point objects.
     */
    addPolygon(points) {
        const ctx = this._ctx;
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
    }

    /**
     * Adds a circle to the rendering queue.
     * @param {Point} point The upper left corner of the circle bounding box.
     * @param {number} diameter The diameter of the circle.
     * @param {boolean} counterClockwise True if the circle is drawn counter-clockwise (will result in a hole if rendered on a clockwise path).
     */
    addCircle(point, diameter, counterClockwise) {
        const ctx = this._ctx,
              radius = diameter / 2;
        ctx.moveTo(point.x + radius, point.y + radius);
        ctx.arc(point.x + radius, point.y + radius, radius, 0, Math.PI * 2, counterClockwise);
        ctx.closePath();
    }

    /**
     * Called when the icon has been completely drawn.
     */
    finish() {
        this._ctx.restore();
    }
}