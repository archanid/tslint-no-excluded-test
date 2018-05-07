import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'no-focused-test',
    description: 'Disallows `fit`, `it.only`, `fdescribe`, `describe.only`.',
    rationale: Lint.Utils.dedent`
            Using one of these functions causes only a subset of tests to run,
            which can easily go unnoticed and lead to a build passing where
            it should fail.
        `,
    optionsDescription: 'Not configurable.',
    options: null,
    optionExamples: ['true'],
    type: 'functionality',
    typescriptOnly: true,
  };

  public static FAILURE_STRING = 'Focused tests are not allowed';

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new NoFocusedTestWalker(sourceFile, this.getOptions()),
    );
  }
}

// tslint:disable max-classes-per-file
class NoFocusedTestWalker extends Lint.RuleWalker {
  public visitCallExpression(node: ts.CallExpression) {
    const nodeText = node.getText();

    if (nodeText.includes('.only') || nodeText.indexOf('fit') === 0 || nodeText.indexOf('fdescribe') === 0) {
      this.addFailure(
        this.createFailure(node.getStart(), 1, Rule.FAILURE_STRING),
      );
    }

    super.visitCallExpression(node);
  }
}
