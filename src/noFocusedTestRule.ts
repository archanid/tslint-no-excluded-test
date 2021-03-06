import { IRuleMetadata, RuleFailure, Rules, RuleWalker } from 'tslint';
import { CallExpression, SourceFile } from 'typescript';

export class Rule extends Rules.AbstractRule {
  public static metadata: IRuleMetadata = {
    ruleName: 'no-focused-test',
    description: 'Disallows `it.only`, `test.only`, and `describe.only`.',
    optionsDescription: 'Not configurable.',
    options: null,
    type: 'functionality',
    typescriptOnly: true,
  };

  public static FAILURE_STRING = 'Focused tests are not allowed';
  public static MATCH_REGEX = /^((describe|it|test)\.only)/;

  public apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NoFocusedTestWalker(sourceFile, this.getOptions()),
    );
  }
}

// tslint:disable max-classes-per-file
class NoFocusedTestWalker extends RuleWalker {
  public visitCallExpression(node: CallExpression) {
    const match = node.getText().match(Rule.MATCH_REGEX);

    if (match && match[0]) {
      this.addFailureAt(node.getStart(), match[0].length, Rule.FAILURE_STRING);
    }

    super.visitCallExpression(node);
  }
}
