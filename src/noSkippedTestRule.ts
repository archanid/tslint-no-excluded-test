import { IRuleMetadata, RuleFailure, Rules, RuleWalker } from 'tslint';
import { CallExpression, SourceFile } from 'typescript';

export class Rule extends Rules.AbstractRule {
  public static metadata: IRuleMetadata = {
    ruleName: 'no-skipped-test',
    description: 'Disallows `it.skip`, `test.skip`, and `describe.skip`.',
    optionsDescription: 'Not configurable.',
    options: null,
    type: 'functionality',
    typescriptOnly: true,
  };

  public static FAILURE_STRING = 'Skipped tests are not allowed';
  public static MATCH_REGEX = /^((describe|it|test)\.skip)/;

  public apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(
      new NoSkippedTestWalker(sourceFile, this.getOptions()),
    );
  }
}

// tslint:disable max-classes-per-file
class NoSkippedTestWalker extends RuleWalker {
  public visitCallExpression(node: CallExpression) {
    const match = node.getText().match(Rule.MATCH_REGEX);

    if (match && match[0]) {
      this.addFailureAt(node.getStart(), match[0].length, Rule.FAILURE_STRING);
    }

    super.visitCallExpression(node);
  }
}
