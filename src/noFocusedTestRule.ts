import { IRuleMetadata, RuleFailure, Rules, RuleWalker, Utils } from 'tslint';
import { CallExpression, SourceFile } from 'typescript';

export class Rule extends Rules.AbstractRule {
  public static metadata: IRuleMetadata = {
    ruleName: 'no-focused-test',
    description: 'Disallows `fit`, `it.only`, `fdescribe`, `describe.only`.',
    optionsDescription: 'Not configurable.',
    options: null,
    type: 'functionality',
    typescriptOnly: true,
  };

  public static FAILURE_STRING = 'Focused tests are not allowed';

  public apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NoFocusedTestWalker(sourceFile, this.getOptions()),
    );
  }
}

// tslint:disable max-classes-per-file
class NoFocusedTestWalker extends RuleWalker {
  public visitCallExpression(node: CallExpression) {
    const nodeText = node.getText();

    if (
      nodeText.indexOf('it.only') === 0 ||
      nodeText.indexOf('describe.only') === 0 ||
      nodeText.indexOf('fit') === 0 ||
      nodeText.indexOf('fdescribe') === 0
    ) {
      this.addFailure(
        this.createFailure(node.getStart(), 1, Rule.FAILURE_STRING),
      );
    }

    super.visitCallExpression(node);
  }
}
