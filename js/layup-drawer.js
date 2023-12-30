"use strict";

function LayupDrawer() {
  /**
   * Canvas element
   */
  this.canvas = null;
  this.heightCanvas = 300;
  this.widthCanvas = 400;
}

LayupDrawer.prototype = {
  /**
   * Configure the canvas
   *
   * @param {HTMLCanvasElement, {height?: int, width?: int}} canvas  Canvas element
   */
  init: function (canvas, conf) {
    this.canvas = canvas;
    if (conf?.height) this.heightCanvas = conf.height;
    if (conf?.width) this.widthCanvas = conf.width;
  },

  /**
   * Draw a layup configuration on the canvas
   *
   * @param {Object} layup Layup object structure
   * @param {Number} length Layup length in mm
   */
  drawLayup: function (layup) {
    if (!this.canvas) {
      console.error("Canvas not initialized. Call init() first.");
      return;
    }

    const context = this.canvas.getContext("2d");
    const layupLength = Object.keys(layup).length;

    // Bar settings
    const barSpacing = 0;
    const padding = 30;
    const marginRight = 140;
    const barColor = "blue";
    const borderColor = "green";
    const imageSrc = "images/paralel-grain-0.jpg";
    const imageSrc90deg = "images/perpendicular-grain-90.jpg";

    // Draw X and Y axis titles
    const xAxisTitle = "Primary Direction";
    const yAxisTitle = "Slab Thickness (mm)";

    // Set a maximum height for the canvas
    const maxCanvasHeight = this.heightCanvas + padding;

    // Calculate dynamic bar height based on the available space
    const dynamicBarHeight = (maxCanvasHeight - padding) / layupLength;

    // Set the canvas height
    this.canvas.width = this.widthCanvas + marginRight;
    this.canvas.height = Math.min((dynamicBarHeight + barSpacing) * layupLength + padding, maxCanvasHeight);

    // Create an image object
    const img = new Image();
    const img90deg = new Image();

    // Load the second image after the first one has loaded
    img.onload = () => {
      img90deg.src = imageSrc90deg;
    };

    // Once both images are loaded, start drawing
    img90deg.onload = () => {
      // Draw X-axis title
      context.fillText(
        xAxisTitle,
        this.canvas.width / 2,
        this.canvas.height - padding + 30
      );

      // Rotate the Y-axis title and draw it
      context.save();
      context.translate(10, this.canvas.height / 2 + padding);
      context.rotate(-Math.PI / 2);
      context.fillText(yAxisTitle, 0, 0);
      context.restore();

      Object.entries(layup).forEach(([key, layer], i) => {
        const barWidth = this.canvas.width - marginRight;

        // Draw the bar with border
        context.fillStyle = barColor;
        context.fillRect(50, i * (dynamicBarHeight + barSpacing), barWidth, dynamicBarHeight);

        // Draw border-top
        context.strokeStyle = borderColor;
        context.beginPath();
        context.moveTo(50, i * (dynamicBarHeight + barSpacing));
        context.lineTo(50 + barWidth, i * (dynamicBarHeight + barSpacing));
        context.stroke();

        // Draw border-bottom
        context.beginPath();
        context.moveTo(50, (i + 1) * (dynamicBarHeight + barSpacing));
        context.lineTo(50 + barWidth, (i + 1) * (dynamicBarHeight + barSpacing));
        context.stroke();

        // Draw image pattern based on the condition
        let pattern;
        if (layer.angle === 90) {
          pattern = context.createPattern(img90deg, "repeat");
          context.fillStyle = pattern;

          // Use a fixed width for the image pattern
          context.fillRect(
            50,
            i * (dynamicBarHeight + barSpacing),
            barWidth,
            dynamicBarHeight
          );
        } else {
          pattern = context.createPattern(img, "repeat");
          context.fillStyle = pattern;

          // Use a fixed width for the image pattern
          context.fillRect(
            50,
            i * (dynamicBarHeight + barSpacing),
            barWidth,
            dynamicBarHeight
          );
        }

        // Draw text labels
        context.fillStyle = "black";
        context.fillText(
          `${key}: ${layer.thickness}mm ${layer.grade}`,
          50 + barWidth + 5,
          (i + 0.5) * (dynamicBarHeight + barSpacing)
        );
      });
    };

    // Set the source of the first image
    img.src = imageSrc;

    // Function to draw the x-axis ruler at the bottom
    const drawXAxis = () => {
      context.beginPath();
      context.moveTo(50, this.canvas.height - padding);
      context.lineTo(this.canvas.width, this.canvas.height - padding);
      context.strokeStyle = "black";
      context.stroke();

      // Add labels on the x-axis at the bottom
      // Example: Label every 50 units
      for (let i = 0; i <= this.canvas.width - 50; i += 50) {
        context.fillText(
          i,
          50 + i,
          this.canvas.height - padding + 15
        );
      }
    };

    // Function to draw the y-axis ruler on the left
    const drawYAxis = () => {
      context.beginPath();
      context.moveTo(50, this.canvas.height - padding);
      context.lineTo(50, 0);
      context.strokeStyle = "black";
      context.stroke();

      // Add labels on the y-axis at the bottom
      // Example: Label every 50 units
      for (let i = 0; i <= this.canvas.height - padding; i += 50) {
        if (this.canvas.height - i - padding != 0)
        context.fillText(
          this.canvas.height - i - padding,
          30,
          i + padding - 15
        );
      }
    };

    // Draw rulers
    drawXAxis();
    drawYAxis();
  },
};
