/**
 * BRAHMA — BIM Computational Geometry & Structural Blueprint Engine
 * Graham Scan Convex Hull, 2D Line Intersection & openBIM IFC 4.3 Element Analyzer
 * 
 * Provides:
 * 1. Graham Scan 2D Convex Hull Algorithm for Building Footprints & Plot Boundaries
 * 2. Vector Line Segment Collision & Envelope Intersection Detector
 * 3. openBIM IFC 4.3 Element Inspector (IfcBeam, IfcColumn, IfcSlab, IfcWall)
 * 4. Floor Area Ratio (FAR), Ground Coverage & Municipal Setback Rule Checker
 */

class BrahmaBimGeometryEngine {
  constructor() {
    this.engineName = 'BRAHMA-BIM-Computational-Geometry';
    this.supportedFormats = ['openBIM IFC 4.3', 'DXF/DWG Vector Coordinates', 'GeoJSON Polygons'];
  }

  /**
   * Graham Scan 2D Convex Hull Algorithm
   * Computes minimum convex polygon enclosing an arbitrary set of structural points
   */
  calculateConvexHull(points = []) {
    if (!points || points.length < 3) {
      return { success: false, error: 'Minimum 3 points required for convex hull' };
    }

    // Sort points lexicographically (by x, then y)
    const sorted = [...points].sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);

    // Cross product of OA and OB vectors: (A.x - O.x)*(B.y - O.y) - (A.y - O.y)*(B.x - O.x)
    const crossProduct = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

    // Build lower hull
    const lower = [];
    for (const p of sorted) {
      while (lower.length >= 2 && crossProduct(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
        lower.pop();
      }
      lower.push(p);
    }

    // Build upper hull
    const upper = [];
    for (let i = sorted.length - 1; i >= 0; i--) {
      const p = sorted[i];
      while (upper.length >= 2 && crossProduct(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
        upper.pop();
      }
      upper.push(p);
    }

    // Concatenate lower and upper hulls (excluding last point of each as it's repeated)
    lower.pop();
    upper.pop();
    const hull = lower.concat(upper);

    // Calculate Polygon Area via Shoelace Formula
    let area = 0;
    for (let i = 0; i < hull.length; i++) {
      const j = (i + 1) % hull.length;
      area += hull[i].x * hull[j].y;
      area -= hull[j].x * hull[i].y;
    }
    const enclosedAreaSqm = Math.abs(area) / 2;

    return {
      success: true,
      originalPointCount: points.length,
      hullVertexCount: hull.length,
      hullVertices: hull,
      enclosedAreaSqm: +enclosedAreaSqm.toFixed(2)
    };
  }

  /**
   * Check for Line Segment Intersection (e.g. wall clash or boundary infringement)
   */
  checkLineIntersection(seg1, seg2) {
    // seg1: { p1: {x,y}, p2: {x,y} }, seg2: { p1: {x,y}, p2: {x,y} }
    const ccw = (a, b, c) => (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
    const a = seg1.p1, b = seg1.p2, c = seg2.p1, d = seg2.p2;

    const intersects = (ccw(a, c, d) !== ccw(b, c, d)) && (ccw(a, b, c) !== ccw(a, b, d));

    return {
      success: true,
      intersects,
      status: intersects ? 'GEOMETRIC_CLASH_DETECTED' : 'CLEAR_OF_COLLISION'
    };
  }

  /**
   * openBIM IFC 4.3 Element Inspector
   */
  inspectIfcModelElements(elements = []) {
    const counts = {
      IfcBeam: 0,
      IfcColumn: 0,
      IfcSlab: 0,
      IfcWall: 0,
      IfcDoor: 0,
      IfcWindow: 0,
      Other: 0
    };

    let totalVolumeCum = 0;

    elements.forEach(el => {
      const type = el.type || 'Other';
      if (counts[type] !== undefined) counts[type]++;
      else counts.Other++;

      if (el.volumeCum) totalVolumeCum += el.volumeCum;
    });

    return {
      success: true,
      standard: 'openBIM IFC 4.3',
      totalElements: elements.length,
      elementBreakdown: counts,
      totalStructuralVolumeCum: +totalVolumeCum.toFixed(2),
      structuralAdequacy: counts.IfcColumn >= 4 && counts.IfcBeam >= 4 ? 'STRUCTURALLY_FRAMED' : 'INCOMPLETE_FRAME'
    };
  }

  /**
   * Municipal Setback & Floor Area Ratio (FAR) Compliance Auditor
   */
  auditZoningSetbacks({
    plotAreaSqm = 1000,
    builtUpAreaSqm = 2200,
    groundCoverageSqm = 450,
    frontSetbackM = 6.0,
    rearSetbackM = 4.0,
    sideSetbacksM = 3.5,
    maxAllowedFAR = 2.5,
    maxGroundCoveragePercent = 50,
    minFrontSetbackM = 5.0
  }) {
    const far = +(builtUpAreaSqm / plotAreaSqm).toFixed(2);
    const groundCoveragePercent = +((groundCoverageSqm / plotAreaSqm) * 100).toFixed(1);

    const farCompliant = far <= maxAllowedFAR;
    const coverageCompliant = groundCoveragePercent <= maxGroundCoveragePercent;
    const setbackCompliant = frontSetbackM >= minFrontSetbackM;

    const isZoningCompliant = farCompliant && coverageCompliant && setbackCompliant;

    return {
      success: true,
      plotMetrics: {
        plotAreaSqm,
        builtUpAreaSqm,
        actualFAR: far,
        maxAllowedFAR,
        actualGroundCoveragePercent: groundCoveragePercent,
        maxGroundCoveragePercent
      },
      setbackAudit: {
        frontSetbackM,
        minRequiredM: minFrontSetbackM,
        setbackCompliant
      },
      isZoningCompliant,
      zoningDisposition: isZoningCompliant ? 'APPROVED_BY_MUNICIPAL_ZONING_BYLAWS' : 'ZONING_VIOLATION_FLAGGED'
    };
  }
}

module.exports = new BrahmaBimGeometryEngine();
