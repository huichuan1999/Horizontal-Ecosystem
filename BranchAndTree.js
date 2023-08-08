class Branch {
  constructor(begin, end, level, totalLevels) {
    this.level = level;
    this.begin = begin;
    this.totalLevels = totalLevels;
    this.end = end;
    let d = dist(this.end.x, this.end.y, this.begin.x, this.begin.y);

    let repulsion = new AttractionBehavior(this.end, d, -0.5);
    physics.addBehavior(repulsion);

    let spring = new VerletSpring2D(this.begin, this.end, d, 0.01);
    physics.addSpring(spring);
    this.finished = false;
  }

  show() {
    stroke(255,150);
    //let sw = 4 / log(this.level + 2);
    //strokeWeight(sw);
    //strokeWeight(map(this.level, totalLevels, 0, 8, 1));
    let sw = map(this.level, this.totalLevels, 0, 8, 1);
    strokeWeight(sw);
    //console.log(`level: ${this.level}, strokeWeight: ${sw}`);
    line(this.begin.x, this.begin.y, this.end.x, this.end.y);
    circle(this.end.x, this.end.y,sw*2);
  }

  branchA() {
    let dir = this.end.sub(this.begin);
    dir.rotate(PI / random(1,6));
    dir.scaleSelf(0.67);
    let newEnd = new VerletParticle2D(this.end.add(dir));
    physics.addParticle(newEnd);
    let b = new Branch(this.end, newEnd, this.level + 1, this.totalLevels);
    return b;
  }

  branchB() {
    let dir = this.end.sub(this.begin);
    dir.rotate(-PI / random(1,4));
    dir.scaleSelf(0.67);
    let newEnd = new VerletParticle2D(this.end.add(dir));
    physics.addParticle(newEnd);
    let b = new Branch(this.end, newEnd, this.level + 1, this.totalLevels);
    return b;
  }
}

class Tree {
    constructor(startX, startY, branchLength, branchCount, physics, levels) {
        this.tree = [];
        this.physics = physics;
        this.branchLength = branchLength;
        this.levels = levels;
        this.branchCount = branchCount;
        //branchCount就是一组里面有几根分形树

        let a = new VerletParticle2D(startX, startY);
        a.lock();
        this.physics.addParticle(a);

        this.generateTree(a, this.branchLength, this.branchCount, this.levels);
    }

    generateTree(rootParticle, branchLength, branchCount, levels) {
        let angleStep = TWO_PI / this.branchCount;

        for (let i = 0; i < this.branchCount; i++) {
            let angle = angleStep * i;
            let b = new VerletParticle2D(rootParticle.x + cos(angle) * branchLength, rootParticle.y + sin(angle) * branchLength);
            this.physics.addParticle(b);
            let rootBranch = new Branch(rootParticle, b, 0, this.levels);
            this.tree.push(rootBranch);
        }

        for (let n = 0; n < levels; n++) {
            for (let i = this.tree.length - 1; i >= 0; i--) {
                if (!this.tree[i].finished) {
                    let a = this.tree[i].branchA();
                    let b = this.tree[i].branchB();
                    this.tree.push(a);
                    this.tree.push(b);
                }
                this.tree[i].finished = true;
            }
        }
    }

    show() {
        for (let i = this.tree.length - 1; i >= 0; i--) {
            this.tree[i].show();
        }
    }

    lockRoot(x, y) {
        this.tree[0].begin.x = x;
        this.tree[0].begin.y = y;
    }
}
